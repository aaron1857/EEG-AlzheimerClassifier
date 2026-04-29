 1. test_0.5s_short.csv (64 rows) 
      * Expected Result: Fails validation. Will trigger the alert: "Recording too short: Need at least 256 time points (2 seconds)."
   2. test_1s_exact.csv (128 rows) 
      * Expected Result: Fails validation. Will trigger the alert: "Recording too short: Need at least 256 time points (2 seconds)."
   3. test_2.5s_truncates.csv (320 rows)
      * Expected Result: Passes validation. Will run inference on exactly 2 chunks (256 rows) and seamlessly truncate the remaining 64
        rows.
   4. test_5s_valid.csv (640 rows)
      * Expected Result: Passes validation. Runs exactly 5 chunks.
   5. test_301s_long.csv (38,528 rows)
      * Expected Result: Fails validation. Will trigger the alert: "Recording too long: Maximum 300 seconds allowed."