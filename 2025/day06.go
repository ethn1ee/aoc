package main

import (
	"bytes"
	"fmt"
	"strconv"
	"strings"
	"unicode"
)

// const test = `123 328  51 64
//  45 64  387 23
//   6 98  215 314
// *   +   *   +  `

func (s solution) Day06(input string) error {
	// input = test
	rows := strings.Split(input, "\n")
	opRow := rows[len(rows)-1]

	sum := 0
	op := ' '

	// determine max row size
	size := 0
	for _, r := range rows {
		if len(r) > size {
			size = len(r)
		}
	}

	var curr int
	for x := range size {
		// vertical number
		nb := new(bytes.Buffer)
		for _, row := range rows[:len(rows)-1] {
			if len(row) <= x {
				continue
			}
			val := row[x]
			if !unicode.IsDigit(rune(val)) {
				continue
			}
			nb.WriteByte(val)
		}

		// if no number, reset variables and continue
		if nb.Len() == 0 {
			op = ' '
			sum += curr
			curr = 0
			continue
		}

		n, err := strconv.Atoi(nb.String())
		if err != nil {
			return fmt.Errorf("failed to parse num: %w", err)
		}

		// find operator
		tmp := ' '
		if len(opRow) > x {
			tmp = rune(opRow[x])
		}
		if unicode.IsSpace(op) {
			op = tmp
		}

		switch op {
		case '*':
			if unicode.IsSpace(tmp) {
				curr *= n
			} else {
				curr = n
			}
		case '+':
			if unicode.IsSpace(tmp) {
				curr += n
			} else {
				curr = n
			}
		}
	}

	sum += curr

	fmt.Println(sum)

	return nil
}
