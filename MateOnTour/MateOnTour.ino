#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

// littleFS Imports
#include <Arduino.h>
#include "FS.h"
#include <LittleFS.h>


#include <ESP32Time.h>

//ESP32Time rtc;
ESP32Time rtc(3600);  // offset in seconds GMT+1


#define FORMAT_LITTLEFS_IF_FAILED true
#define CLEAR_SENSOR_STORAGE true


#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"

// Set and read the hider name uuid
#define WRITE_HIDER_CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
// set and read the hide date
#define WRITE_HIDE_DATE_CHARACTERISTIC_UUID "489954f8-92c2-4449-b3d7-6ac3e41bcce8"

BLEUUID *WRITE_HIDER_UUID = new BLEUUID(WRITE_HIDER_CHARACTERISTIC_UUID);
BLEUUID *WRITE_HIDE_DATE_UUID = new BLEUUID(WRITE_HIDE_DATE_CHARACTERISTIC_UUID);

// Toggle To Send Sensor Data
BLECharacteristic sendSensorDataToggle("0a036069-5526-4023-9b1a-3f1bb713bf68", BLECharacteristic::PROPERTY_WRITE);

// Input To Set Time
BLECharacteristic setTimeCharacteristic("331f29ef-4396-4a63-a012-496def467096", BLECharacteristic::PROPERTY_WRITE);

// Sensor Data
BLECharacteristic sensorDataCharacteristic("f78ebbff-c8b7-4107-93de-889a6a06d408", BLECharacteristic::PROPERTY_NOTIFY);
BLEDescriptor sensorDataCharacteristicDescripter(BLEUUID((uint16_t)0x2902));

#define maxStringLength 50
String lastHider = "unset";
String lastHideDate = "unset";

bool deviceConnected = false;

double tempF;

int sense_count = 0;

// 20 the the maximum size but we will do 40 and then yell if it goes over
char *sensorBuff = (char *)calloc(40, sizeof(char));

class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer *pServer) {
    deviceConnected = true;
  };
  void onDisconnect(BLEServer *pServer) {
    deviceConnected = false;
    pServer->startAdvertising();
  }
};

class SentTimeCallback : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    unsigned long valueAsEpoch = strtoul(pCharacteristic->getValue().c_str(), NULL, 10);
    Serial.println(valueAsEpoch);
    rtc.setTime(valueAsEpoch);
  }
};


void setup() {
  Serial.begin(115200);
  SetupDevices();


  // Settng up recording files
  if (!LittleFS.begin(FORMAT_LITTLEFS_IF_FAILED)) {
    Serial.println("LittleFS Mount Failed");
    return;
  }
  if (CLEAR_SENSOR_STORAGE || !doesFileExit(LittleFS, "/tempF.txt")) {
    Serial.println("Creating tempF file");
    writeFile(LittleFS, "/tempF.txt", "");
  } else {
    Serial.println("Found existing Tempf file");
  }

  //Callback declared here so that writeFile is in scope
  class SetValuesCallback : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      String value = pCharacteristic->getValue();

      if (value.length() > 0) {
        Serial.println("*********");
        if (pCharacteristic->getUUID().equals(*WRITE_HIDER_UUID)) {
          Serial.print("New Hider: ");
          for (int i = 0; i < value.length(); i++) {
            Serial.print(value[i]);
          }

          if (value.length() < maxStringLength) {
            lastHider = value;
            writeFile(LittleFS, "/lastHider.txt", value.c_str());
          }
        } else if (pCharacteristic->getUUID().equals(*WRITE_HIDE_DATE_UUID)) {
          Serial.print("New HideDate: ");
          for (int i = 0; i < value.length(); i++) {
            Serial.print(value[i]);
          }

          if (value.length() < maxStringLength) {
            lastHideDate = value;
            writeFile(LittleFS, "/lastHideDate.txt", value.c_str());
          }
        }
        Serial.println();
        Serial.println("*********");
      }
    }
  };

  class SendSensorDataToggleCallback : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      String fileData = readFile(LittleFS, "/tempF.txt");
      Serial.println(fileData);
      char buff[21];
      for (int i = 0; i < fileData.length(); i++) {
        int buffIndex = 0;
        while (i < fileData.length() && fileData.charAt(i) != ';' && fileData.charAt(i) != 0 && buffIndex < 20) {
          buff[buffIndex++] = fileData.charAt(i++);
        }
        buff[buffIndex] = 0;
        //Set sensor characteristic value and notify connected client
        sensorDataCharacteristic.setValue(buff);
        sensorDataCharacteristic.notify();
        delay(100);
      }
      writeFile(LittleFS, "/tempF.txt", "");
    }
  };

  // Loads old hidder data
  lastHider = readFile(LittleFS, "/lastHider.txt");
  lastHideDate = readFile(LittleFS, "/lastHideDate.txt");
  rtc.setTime(readTimeFile(LittleFS, "/lastTime.txt"));  // 17th Jan 2021 15:24:30


  BLEDevice::init("MateOnTour - Tony Tone");
  BLEServer *pServer = BLEDevice::createServer();

  BLEService *pService = pServer->createService(BLEUUID(SERVICE_UUID), 25);
  pServer->setCallbacks(new MyServerCallbacks());

  SetValuesCallback *valuesCallback = new SetValuesCallback();

  BLECharacteristic *pHiderCharacteristic =
    pService->createCharacteristic(WRITE_HIDER_CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);
  pHiderCharacteristic->setCallbacks(valuesCallback);
  pHiderCharacteristic->setValue(lastHider);

  BLECharacteristic *pHideDateCharacteristic =
    pService->createCharacteristic(WRITE_HIDE_DATE_CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);
  pHideDateCharacteristic->setCallbacks(valuesCallback);
  pHideDateCharacteristic->setValue(lastHideDate);

  pService->addCharacteristic(&sensorDataCharacteristic);
  sensorDataCharacteristicDescripter.setValue("Toggle to recieve sensor data");
  sensorDataCharacteristic.addDescriptor(&sensorDataCharacteristicDescripter);

  // add the sendSensorDataToggle
  pService->addCharacteristic(&sendSensorDataToggle);
  sendSensorDataToggle.setCallbacks(new SendSensorDataToggleCallback());

  // add the setTimeCharacteristic
  pService->addCharacteristic(&setTimeCharacteristic);
  setTimeCharacteristic.setCallbacks(new SentTimeCallback());

  pService->start();

  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->start();
}

void loop() {
  // put your main code here, to run repeatedly:
  tempF = readThermistorTemperature(lastHider, lastHideDate);
  int lightSensor = readLightSensor() / 10;
  static char temperatureFTemp[7];
  dtostrf(tempF, 3, 1, temperatureFTemp);
  sprintf(sensorBuff, "%lu %s %d;", rtc.getEpoch(), temperatureFTemp, lightSensor);
  Serial.println(sensorBuff);
  appendFile(LittleFS, "/tempF.txt", sensorBuff);
  for (int i = 0; i < 19; i++) {
    if (sensorBuff[21 + i] != 0) {
      Serial.println("IMPENDING DATA LOSS FROM TOO LONG PACKET");
    }
  }
  memset(sensorBuff, '\0', sizeof(sensorBuff));
  if (sense_count++ % 16 == 15) {
    writeTimeFile(LittleFS, "/lastTime.txt", rtc.getEpoch());
  }
  delay(5000);
}
