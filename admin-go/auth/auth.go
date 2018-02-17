package auth

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gertjaap/litbox/logging"
	"net/http"
	"time"
)

// Todo: generate key on first startup and store it in a file.
func signingKey() []byte {
	return []byte("testsigningkey")
}

// Authentication middleware. Will check if a valid JWT is part
// of the client's cookies and redirect the user to the login page
// if this is not the case.
func AuthenticationGuard(h http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
		
		cookie, _ := r.Cookie("jwt")
		if(cookie == nil) {
			http.Redirect(w, r, "/login", 301);
			return
		}
		
		token, err := jwt.ParseWithClaims(cookie.Value,  &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
			return signingKey(), nil
		});
		if err != nil {
			logging.Error.Printf("Error parsing JWT", err);
			http.Redirect(w, r, "/login", 301);
			return
		}

		if token.Valid {
			h(w, r);
		} else {
			http.Redirect(w, r, "/login", 301);
			return
		}
    }
}

// Authentication endpoint. Will return a JWT cookie and redirect the
// user to the homepage if authentication is succesful, or will return
// the user to the login page if not.
func Login(w http.ResponseWriter, r *http.Request) {
	
	// Create the Claims
	claims := &jwt.StandardClaims{
		ExpiresAt: time.Now().Add(60 * time.Minute).Unix(),
		Issuer:    "test",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString(signingKey())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal server error"))
		return
	}
	expiration := time.Now().Add(60 * time.Minute)
    cookie := http.Cookie{Name: "jwt", Value: ss, Expires: expiration}
	http.SetCookie(w, &cookie)
	http.Redirect(w, r, "/", 301);
}

func Logout(w http.ResponseWriter, r *http.Request) {
	expiration := time.Now().Add(-60 * time.Minute)
    cookie := http.Cookie{Name: "jwt", Value: "", Expires: expiration}
	http.SetCookie(w, &cookie)
	http.Redirect(w, r, "/", 301);
}