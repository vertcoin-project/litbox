package routes

import (
    "fmt"
    "html/template"
    "log"
    "net/http"
)

type Context struct {
    Title  string
    Static string
}

func Render(w http.ResponseWriter, tmpl string, context Context) {
    context.Static = STATIC_URL
    tmpl_list := []string{"templates/base.html",
        fmt.Sprintf("templates/%s.html", tmpl)}
    t, err := template.ParseFiles(tmpl_list...)
    if err != nil {
        log.Print("template parsing error: ", err)
    }
    err = t.Execute(w, context)
    if err != nil {
        log.Print("template executing error: ", err)
    }
}