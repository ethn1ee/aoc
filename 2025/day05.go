package main

import (
	"fmt"
	"slices"
	"strconv"
	"strings"
)

// const test = `3-5
// 10-14
// 16-20
// 12-18

// 1
// 5
// 8
// 11
// 17
// 32`

func (s solution) Day05(input string) error {
	// input = test
	split := strings.Split(input, "\n\n")

	ranges := make([][]int, 0)
	maxID := 0
	for r := range strings.SplitSeq(split[0], "\n") {
		rSplit := strings.Split(r, "-")
		min, err := strconv.Atoi(rSplit[0])
		if err != nil {
			return fmt.Errorf("failed to parse min: %w", err)
		}
		max, err := strconv.Atoi(rSplit[1])
		if err != nil {
			return fmt.Errorf("failed to parse max: %w", err)
		}
		if max > maxID {
			maxID = max
		}

		ranges = append(ranges, []int{min, max})
	}

	slices.SortFunc(ranges, func(a []int, b []int) int {
		if a[0] < b[0] {
			return -1
		}
		if a[0] > b[0] {
			return 1
		}
		return 0
	})

	newRanges := [][]int{ranges[0]}

	for _, r := range ranges[1:] {
		lastRange := newRanges[len(newRanges)-1]
		if r[0] <= lastRange[1] {
			if r[1] > lastRange[1] {
				newRanges[len(newRanges)-1] = []int{lastRange[0], r[1]}
			}
		} else {
			newRanges = append(newRanges, r)
		}
	}
	fmt.Println(newRanges)

	count := 0
	for _, r := range newRanges {
		count += r[1] - r[0] + 1
	}

	fmt.Println(count)

	return nil
}
