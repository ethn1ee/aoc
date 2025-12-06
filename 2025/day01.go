package main

import (
	"fmt"
	"strconv"
	"strings"
)

// const test = `
// L68
// L30
// R48
// L5
// R60
// L55
// L1
// L99
// R14
// L82
// `

func (s solution) Day01(input string) error {
	// input = test
	count := 0
	lines := strings.SplitSeq(input, "\n")
	curr := 50

	for rot := range lines {
		if len(rot) < 2 {
			continue
		}

		dir := rot[0]
		dist, err := strconv.Atoi(rot[1:])
		if err != nil {
			return fmt.Errorf("failed to parse distance: %w", err)
		}

		switch dir {
		case 'L':
			if curr == 0 {
				curr = 100
			}
			temp := curr - dist
			for temp <= 0 {
				temp += 100
				count++
			}
			curr = temp
		case 'R':
			temp := curr + dist
			for temp >= 100 {
				temp -= 100
				count++
			}
			curr = temp
		}
		curr %= 100
	}

	fmt.Println(count)

	return nil
}
