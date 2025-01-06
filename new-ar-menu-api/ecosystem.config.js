module.exports = {
  apps : [{
    name   : "ar-menu-api",
    script : "./app.js",
    watch : false,
    exec_mode: 'cluster',
    env_development : {
      NODE_ENV: "development",
      DB_URL: "mongodb://localhost/ar_menu_db",
      JWT_KEY: "ar_menu_jwtPrivateKey",
    },
    env : {
      NODE_ENV: "production",
      DB_URL: "mongodb://database:27017/ar_menu_db",
      JWT_KEY: "ar_menu_jwtPrivateKey",
    },
  }]
}
