package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/google/cel-go/cel"
)

// Request structure to handle incoming POST data with expression and input
type Request struct {
	Expression string                 `json:"expression"`
	Input      map[string]interface{} `json:"input"`
}

// Response structure to return result
type Response struct {
	Result interface{} `json:"result"`
	Error  string      `json:"error,omitempty"`
}

// evaluateExpression evaluates the expression using cel-go with input data
func evaluateExpression(expression string, input map[string]interface{}) (interface{}, error) {
	// Create a new CEL environment
	env, err := cel.NewEnv()
	if err != nil {
		return nil, err
	}

	// Parse the expression
	parsedExpr, issues := env.Parse(expression)
	if issues != nil && issues.Err() != nil {
		return nil, issues.Err()
	}

	// Create an evaluator for the parsed expression
	prg, err := env.Program(parsedExpr)
	if err != nil {
		return nil, err
	}

	// Evaluate the expression with the input data as context
	result, _, err := prg.Eval(input)
	if err != nil {
		return nil, err
	}

	return result, nil
}

// handler function to process incoming POST requests with expression and input
func handler(w http.ResponseWriter, r *http.Request) {
	// Ensure the request method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse the JSON request body
	var req Request
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Evaluate the expression with the provided input
	result, err := evaluateExpression(req.Expression, req.Input)
	response := Response{Result: result}

	if err != nil {
		// If error, return it in the response
		response.Error = err.Error()
	}

	// Set content type as JSON and return the response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
gi
func main() {
	// Set up the HTTP server
	http.HandleFunc("/api/evaluate", handler)

	// Start the server on port 3002
	fmt.Println("Server started at http://localhost:3002")
	log.Fatal(http.ListenAndServe(":3002", nil))
}
