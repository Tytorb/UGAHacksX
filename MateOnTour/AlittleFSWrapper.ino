bool doesFileExit(fs::FS &fs, const char *path) {
  File file = fs.open(path);
  if (!file || file.isDirectory()) {
    return false;
  }
  file.close();
  return true;
}


String readFile(fs::FS &fs, const char *path) {
  File file = fs.open(path);
  if (!file || file.isDirectory()) {
    return "unset";
  }
  String temp;
  while (file.available()) {
    temp = file.readString();
  }
  file.close();
  return temp;
}

unsigned long readTimeFile(fs::FS &fs, const char *path) {
  File file = fs.open(path);
  if (!file || file.isDirectory()) {
    return 1739029077;
  }
  String temp;
  while (file.available()) {
    temp = file.readString();
  }
  file.close();
  return strtoul(temp.c_str(), NULL, 10);
}

bool writeTimeFile(fs::FS &fs, const char *path, unsigned long value) {
  File file = fs.open(path, FILE_WRITE);
  if (!file) {
    return false;
  }
  bool res = false;
  char str[30];
  ultoa(value, str, 10);
  if (file.print(str)) {
    Serial.print("succeded write");
    res = true;
  }else {
    Serial.print("failed write");
  }
  file.close();
  return res;
}

bool writeFile(fs::FS &fs, const char *path, const char *message) {
  File file = fs.open(path, FILE_WRITE);
  if (!file) {
    return false;
  }
  bool res = false;
  if (file.print(message)) {
    Serial.print("succeded write");
    res = true;
  }else {
    Serial.print("failed write");
  }
  file.close();
  return res;
}

bool appendFile(fs::FS &fs, const char *path, const char *message) {
  File file = fs.open(path, FILE_APPEND);
  if (!file) {
    return false;
  }
  bool res = false;
  if (file.print(message)) {
    res = true;
  }
  file.close();
  return res;
}