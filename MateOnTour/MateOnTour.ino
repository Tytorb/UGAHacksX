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
#define CLEAR_SENSOR_STORAGE false



#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define WRITE_HIDER_CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define WRITE_HIDE_DATE_CHARACTERISTIC_UUID "489954f8-92c2-4449-b3d7-6ac3e41bcce8"

BLEUUID *WRITE_HIDER_UUID = new BLEUUID(WRITE_HIDER_CHARACTERISTIC_UUID);
BLEUUID *WRITE_HIDE_DATE_UUID = new BLEUUID(WRITE_HIDE_DATE_CHARACTERISTIC_UUID);

// Toggle To Send Sensor Data
BLECharacteristic sendSensorDataToggle("0a036069-5526-4023-9b1a-3f1bb713bf68", BLECharacteristic::PROPERTY_WRITE);

// Temp Data
BLECharacteristic sensorDataCharacteristic("f78ebbff-c8b7-4107-93de-889a6a06d408", BLECharacteristic::PROPERTY_NOTIFY);
BLEDescriptor sensorDataCharacteristicDescripter(BLEUUID((uint16_t)0x2902));

#define maxStringLength 50
String lastHider = "unset";
String lastHideDate = "unset";

bool deviceConnected = false;

double tempF;

char *sensorBuff = (char*)calloc(100, sizeof(char)); ;

class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer *pServer) {
    deviceConnected = true;
  };
  void onDisconnect(BLEServer *pServer) {
    deviceConnected = false;
    pServer->startAdvertising();
  }
};

void setup() {
  Serial.begin(115200);
  rtc.setTime(30, 24, 15, 8, 2, 2024);  // 17th Jan 2021 15:24:30

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
      char buff[20];
      for (int i = 0; i < fileData.length(); i++) {
        int buffIndex = 0;
        while (i < fileData.length() && fileData.charAt(i) != ';' && buffIndex < 20) {
          buff[buffIndex++] = fileData.charAt(i++);
        }
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

  BLEDevice::init("MateOnTour - Rocky");
  BLEServer *pServer = BLEDevice::createServer();

  BLEService *pService = pServer->createService(SERVICE_UUID);
  pServer->setCallbacks(new MyServerCallbacks());

  SetValuesCallback *valuesCallback = new SetValuesCallback();

  BLECharacteristic *pHiderCharacteristic =
    pService->createCharacteristic(WRITE_HIDER_CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);
  pHiderCharacteristic->setCallbacks(valuesCallback);
  pHiderCharacteristic->setValue(lastHider);

  BLECharacteristic *pHideDateCharacteristic =
    pService->createCharacteristic(WRITE_HIDE_DATE_CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);
  pHideDateCharacteristic->setCallbacks(valuesCallback);
  pHiderCharacteristic->setValue(lastHideDate);

  pService->addCharacteristic(&sensorDataCharacteristic);
  sensorDataCharacteristicDescripter.setValue("Toggle to recieve sensor data");
  sensorDataCharacteristic.addDescriptor(&sensorDataCharacteristicDescripter);

  // add the sendSensorDataToggle
  pService->addCharacteristic(&sendSensorDataToggle);
  sendSensorDataToggle.setCallbacks(new SendSensorDataToggleCallback());

  pService->start();

  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->start();
}

void loop() {
  // put your main code here, to run repeatedly:
  tempF = random(500) / 10;
  static char temperatureFTemp[6];
  dtostrf(tempF, 6, 2, temperatureFTemp);
  sprintf(sensorBuff, "%lu", rtc.getEpoch());
  strcat(sensorBuff, " ");
  strcat(sensorBuff, temperatureFTemp);
  strcat(sensorBuff, ";");
  Serial.println(sensorBuff);
  appendFile(LittleFS, "/tempF.txt", sensorBuff);
  memset(sensorBuff, '\0', sizeof(sensorBuff));
  delay(5000);
}
