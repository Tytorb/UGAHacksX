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