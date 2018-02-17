package routes

import (
    "net/http"
)

func Home(w http.ResponseWriter, req *http.Request) {
    context := Context{Title: "Welcome!"}
    Render(w, "index", context)
}
