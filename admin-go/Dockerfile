FROM golang:alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh gcc musl-dev

WORKDIR /go/src/github.com/gertjaap/litbox
COPY . .
RUN go get -d -v ./...
RUN go install -v ./...

ENTRYPOINT ["litbox"]