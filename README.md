# ksense
Post response results:

@dm-bit1 ➜ /workspaces/ksense (main) $ node solution.js
[dotenv@17.2.1] injecting env (1) from .env -- tip: 📡 version env with Radar: https://dotenvx.com/radar
Assessment Results: {
  success: true,
  message: 'Assessment submitted successfully',
  requestId: 'iad1::wh7s9-1754100590107-11791198b513',
  results: {
    score: 83.75,
    percentage: 84,
    status: 'PASS',
    breakdown: { high_risk: [Object], fever: [Object], data_quality: [Object] },
    feedback: { strengths: [Array], issues: [Array] },
    attempt_number: 1,
    max_attempts: 3,
    remaining_attempts: 2,
    is_personal_best: true,
    best_score: 84,
    best_attempt_number: 1,
    can_resubmit: true,
    processed_in_ms: 202
  }
}


@dm-bit1 ➜ /workspaces/ksense (main) $ node solution.js
[dotenv@17.2.1] injecting env (1) from .env -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit
Assessment Results:
 {
  "success": true,
  "message": "Assessment submitted successfully",
  "requestId": "iad1::nb48s-1754145838403-c03b577615c2",
  "results": {
    "score": 83.75,
    "percentage": 84,
    "status": "PASS",
    "breakdown": {
      "high_risk": {
        "score": 40,
        "max": 50,
        "correct": 20,
        "submitted": 20,
        "matches": 18
      },
      "fever": {
        "score": 25,
        "max": 25,
        "correct": 9,
        "submitted": 9,
        "matches": 9
      },
      "data_quality": {
        "score": 19,
        "max": 25,
        "correct": 8,
        "submitted": 6,
        "matches": 6
      }
    },
    "feedback": {
      "strengths": [
        "✅ Fever patients: Perfect score (9/9)"
      ],
      "issues": [
        "🔄 High-risk patients: 18/20 correct. Check for 2 incorrectly included and 2 missed patients",
        "🔄 Data quality issues: 6/8 correct, but 2 missed"
      ]
    },
    "attempt_number": 2,
    "max_attempts": 3,
    "remaining_attempts": 1,
    "is_personal_best": true,
    "best_score": 84,
    "best_attempt_number": 2,
    "can_resubmit": true,
    "processed_in_ms": 204
  }
}

Assessment Results:
 {
  "success": true,
  "message": "Assessment submitted successfully",
  "requestId": "iad1::b7c6q-1754153715747-1fa86c607aad",
  "results": {
    "score": 95,
    "percentage": 95,
    "status": "PASS",
    "breakdown": {
      "high_risk": {
        "score": 45,
        "max": 50,
        "correct": 20,
        "submitted": 18,
        "matches": 18
      },
      "fever": {
        "score": 25,
        "max": 25,
        "correct": 9,
        "submitted": 9,
        "matches": 9
      },
      "data_quality": {
        "score": 25,
        "max": 25,
        "correct": 8,
        "submitted": 8,
        "matches": 8
      }
    },
    "feedback": {
      "strengths": [
        "✅ Fever patients: Perfect score (9/9)",
        "✅ Data quality issues: Perfect score (8/8)"
      ],
      "issues": [
        "🔄 High-risk patients: 18/20 correct, but 2 missed"
      ]
    },
    "attempt_number": 3,
    "max_attempts": 3,
    "remaining_attempts": 0,
    "is_personal_best": true,
    "best_score": 95,
    "best_attempt_number": 3,
    "can_resubmit": false,
    "processed_in_ms": 204
  }
}