module.exports = {
  webToken: {
    secretKey: genSecKey(256),
    expiresIn: 1200, //1 minute
  },
 

  mongoDb: {
    host: "mongodb",
    port: "27017",
    username: "umarabox",
    password: "secret",
    database: "db",
  },
};
function genSecKey(len) {
  let a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let aLen = a.length;
  let str = "";
  for (var i = 0; i < len; i++) {
    var pos = Math.ceil(Math.random() * aLen - 1);
    str += a[pos];
  }
  return str;
}
