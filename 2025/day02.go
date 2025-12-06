package main

import (
	"fmt"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
)

// const test = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`

func (s solution) Day02(input string) error {
	// input = test
	ranges := strings.SplitSeq(input, ",")

	var (
		ans atomic.Int64
		wg  sync.WaitGroup
	)
	errCh := make(chan error)
	ans.Store(0)

	for r := range ranges {
		wg.Go(func() {
			split := strings.SplitN(r, "-", 2)
			min, err := strconv.Atoi(split[0])
			if err != nil {
				errCh <- fmt.Errorf("failed to parse min: %w", err)
				return
			}
			max, err := strconv.Atoi(split[1])
			if err != nil {
				errCh <- fmt.Errorf("failed to parse max: %w", err)
				return
			}

			id := min
			for id <= max {
				if isValid(id) {
					ans.Add(int64(id))
				}
				id++
			}
		})
	}

	wg.Wait()
	close(errCh)

	for err := range errCh {
		return err
	}

	fmt.Println(ans.Load())

	return nil
}

func isValid(n int) bool {
	str := strconv.Itoa(n)

	var repeated string
loop:
	for i := range str {
		if i == 0 {
			continue
		}
		if i > len(str)/2 {
			break
		}
		if str[:i] == str[i:2*i] {
			repeated = str[:i]
			lr := len(repeated)
			if len(str)%lr != 0 {
				continue loop
			}
			for j := range len(str) / lr {
				if repeated != str[j*lr:(j+1)*lr] {
					continue loop
				}
			}

			return true
		}
	}
	return false
}
