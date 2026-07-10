FROM golang:1.21-alpine AS builder
WORKDIR /anshul
COPY go.mod ./
RUN go mod download
COPY . .
RUN go build -o backend /cmd/server/main.go

FROM alpine:3.19
WORKDIR /anshul
COPY --from=builder /app/backend .
CMD ["./backend"]