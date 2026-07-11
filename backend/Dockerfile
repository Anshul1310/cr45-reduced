FROM golang:1.26-alpine AS builder
WORKDIR /anshul
COPY go.mod .
RUN go mod download
COPY . .
RUN go build -o backend ./cmd/server/main.go

FROM alpine:3.19
WORKDIR /anshul
COPY --from=builder /anshul/backend .
EXPOSE 8080
CMD ["./backend"]
