package main

import (
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"reflect"
	"strconv"
)

const year = 2025

type solution struct{}

func main() {
	if len(os.Args) < 2 {
		log.Fatal("must provide day")
	}

	day, err := strconv.Atoi(os.Args[1])
	if err != nil {
		log.Fatal("day must be an integer")
	}

	if day <= 0 || day > 12 {
		log.Fatal("day must be between 1 and 12 (inclusive)")
	}

	input, err := getInput(day)
	if err != nil {
		log.Fatalf("failed to get input: %v", err)
	}

	fnName := fmt.Sprintf("Day%02d", day)
	val := reflect.ValueOf(new(solution))
	fn := val.MethodByName(fnName)

	if !fn.IsValid() || fn.Kind() != reflect.Func {
		log.Fatalf("function %s not found", fnName)
	}

	if fn.Type().NumIn() != 1 {
		log.Fatalf("funtion %s must have 1 argument, but it has %d", fnName, fn.Type().NumIn())
	}

	fn.Call([]reflect.Value{reflect.ValueOf(input)})
}

func getInput(day int) (string, error) {
	token, ok := os.LookupEnv("SESSION_TOKEN")
	if !ok {
		return "", errors.New("environment variable SESSION_TOKEN required")
	}

	url := fmt.Sprintf(
		"https://adventofcode.com/%d/day/%d/input",
		year, day,
	)

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Add("Cookie", fmt.Sprintf("session=%s", token))

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to fetch: %w", err)
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read body: %w", err)
	}

	return string(body), nil
}
