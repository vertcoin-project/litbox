package main

import (
    "github.com/gertjaap/litbox/auth"
    "github.com/gertjaap/litbox/logging"
    "github.com/gertjaap/litbox/routes"
    "net/http"
    "os"
)



func main() {
    logging.Init(os.Stdout, os.Stdout, os.Stdout, os.Stdout)

    http.HandleFunc("/", auth.AuthenticationGuard(routes.Home))
    http.HandleFunc("/login", routes.Login);
    http.HandleFunc("/logout", routes.Logout);
    http.HandleFunc(routes.STATIC_URL, routes.Static)
    err := http.ListenAndServe(":3000", nil)
    if err != nil {
        logging.Error.Println("ListenAndServe: ", err)
    }
}