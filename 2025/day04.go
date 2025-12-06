package main

import (
	"fmt"
	"strings"
)

// const test = `..@@.@@@@.
// @@@.@.@.@@
// @@@@@.@.@@
// @.@@@@..@.
// @@.@@@@.@@
// .@@@@@@@.@
// .@.@.@.@@@
// @.@@@.@@@@
// .@@@@@@@@.
// @.@.@@@.@.`

func (s solution) Day04(input string) error {
	// input = test

	grid := strings.Split(input, "\n")
	count := 0

	for {
		toRemove := make([][]int, 0)
		for y, row := range grid {
			for x, val := range row {
				if val == '@' && neighbors(grid, x, y) < 4 {
					toRemove = append(toRemove, []int{x, y})
				}
			}
		}
		if len(toRemove) == 0 {
			break
		}
		count += len(toRemove)

		for _, coord := range toRemove {
			row := grid[coord[1]]
			grid[coord[1]] = row[:coord[0]] + "x" + row[coord[0]+1:]
		}
	}

	fmt.Println(count)

	return nil
}

func neighbors(grid []string, x, y int) int {
	count := 0
	offsets := []int{-1, 0, 1}
	for _, offsetX := range offsets {
		for _, offsetY := range offsets {
			if offsetX == 0 && offsetY == 0 {
				continue
			}

			newX, newY := x+offsetX, y+offsetY
			if 0 <= newX && newX < len(grid[0]) &&
				0 <= newY && newY < len(grid) &&
				grid[newY][newX] == '@' {
				count++
			}
		}
	}

	return count
}
