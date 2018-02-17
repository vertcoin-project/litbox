package routes

import (
    "github.com/gertjaap/litbox/auth"
    "net/http"
 )

func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
    	context := Context{Title: "Welcome!"}
		Render(w, "login", context)
	} else if r.Method == "POST" {
		auth.Login(w, r);
	}
}

func Logout(w http.ResponseWriter, r *http.Request) {
	auth.Logout(w, r);
}
 