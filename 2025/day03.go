package main

import (
	"fmt"
	"math"
	"strings"
)

// const test = `987654321111111
// 811111111111119
// 234234234234278
// 818181911112111`

func (s solution) Day03(input string) error {
	// input = test
	lines := strings.SplitSeq(input, "\n")
	ans := 0

	for line := range lines {
		ans += getMax(line, 12)
	}

	fmt.Println(ans)

	return nil
}

func getMax(jolts string, digits int) int {
	if digits == 0 {
		return 0
	}

	maxIdx := 0
	for i, r := range jolts[:len(jolts)-digits+1] {
		if r > rune(jolts[maxIdx]) {
			maxIdx = i
		}
	}

	maxJolt := int(jolts[maxIdx] - '0')

	return maxJolt*int(math.Pow10(digits-1)) + getMax(jolts[maxIdx+1:], digits-1)
}
