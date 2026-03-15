# Data Model: Roost MVP

**Date:** 2026-03-14

---

## Firestore Collections

### `users/{userId}` (document)

Top-level user document. Created on registration.

| Field              | Type      | Required | Description                                      |
|--------------------|-----------|----------|--------------------------------------------------|
| userId             | string    | Yes      | Firebase Auth UID                                |
| email              | string    | Yes      | User's email address                             |
| resumeUrl          | string    | Yes      | Firebase Storage path to uploaded resume          |
| coverLetterUrl     | string    | No       | Firebase Storage path to cover letter             |
| parsedResume       | map       | Yes      | Structured data extracted from resume (see below) |
| questionnaire      | map       | Yes      | All questionnaire answers (see below)            |
| profileAssembledAt | timestamp | Yes      | When profile was finalized                       |
| agentStatus        | string    | Yes      | `'pending'` | `'processing'` | `'complete'` | `'error'` |

**State transitions for `agentStatus`:**
```
pending → processing → complete
                     → error
```
- `pending`: Profile assembled, agents not yet triggered
- `processing`: Agent trigger called, agents running
- `complete`: All agents finished successfully
- `error`: At least one critical agent failed

**Identity & uniqueness:** One document per Firebase Auth user. Document ID = Firebase Auth UID.

---

### `parsedResume` (embedded map)

| Field               | Type       | Required | Description                              |
|---------------------|------------|----------|------------------------------------------|
| jobTitles           | string[]   | Yes      | Extracted job titles from work history    |
| skills              | string[]   | Yes      | Technical and soft skills                |
| yearsExperience     | number     | Yes      | Total years of professional experience   |
| education           | map[]      | Yes      | Array of education entries               |
| education[].institution | string | Yes      | School/university name                   |
| education[].degree  | string     | Yes      | Degree type (BS, MS, PhD, etc.)          |
| education[].year    | number     | Yes      | Graduation year                          |
| estimatedSalaryRange | map       | Yes      | `{ min: number, max: number }`           |
| industries          | string[]   | Yes      | Industries the user has worked in        |
| summary             | string     | Yes      | AI-generated career summary              |

---

### `questionnaire` (embedded map)

#### `career` section
| Field             | Type     | Values                                                    |
|-------------------|----------|-----------------------------------------------------------|
| industryOpenness   | string   | `'same'` | `'adjacent'` | `'open'` | `'completely_open'`    |
| minSalary          | number   | Minimum acceptable salary (USD)                           |
| workStyle          | string   | `'remote'` | `'hybrid'` | `'in_person'` | `'no_preference'` |
| companySizePref    | string   | `'startup'` | `'small'` | `'medium'` | `'large'` | `'no_preference'` |
| excludedIndustries | string[] | Industries user wants to avoid                            |

#### `lifestyle` section
| Field                | Type     | Values                                                |
|----------------------|----------|-------------------------------------------------------|
| climatePref          | string   | `'warm'` | `'mild'` | `'cold_ok'` | `'no_preference'`  |
| humidityTolerance    | string   | `'low'` | `'medium'` | `'high'`                       |
| hobbies              | string[] | Free-text list of hobbies/activities                  |
| walkabilityImportance | string  | `'essential'` | `'preferred'` | `'not_important'`    |
| foodPriorities       | string[] | Food-related priorities (e.g., "vegan options")       |
| nightlifeImportance  | string   | `'essential'` | `'preferred'` | `'not_important'`    |

#### `practical` section
| Field          | Type    | Values                                                     |
|----------------|---------|-------------------------------------------------------------|
| maxRent        | number  | Maximum monthly rent (USD)                                  |
| hasPartner     | boolean | Whether user has a partner                                  |
| partnerJobNeeds | string | Partner's job/industry needs (only if hasPartner = true)    |
| proximityTo    | string[] | Places/people user wants to be near                        |
| moveTimeline   | string  | `'asap'` | `'3_months'` | `'6_months'` | `'1_year'` | `'flexible'` |
| petFriendly    | boolean | Whether user needs pet-friendly housing                     |

#### `values` section
| Field              | Type   | Values                                                    |
|--------------------|--------|-----------------------------------------------------------|
| politicalLeaning   | string | `'progressive'` | `'moderate'` | `'conservative'` | `'no_preference'` |
| gunLawPref         | string | `'strict'` | `'moderate'` | `'permissive'` | `'no_preference'` |
| diversityImportance | string | `'essential'` | `'preferred'` | `'not_important'`    |
| settingPref        | string | `'urban'` | `'suburban'` | `'rural'` | `'no_preference'`   |

---

### `users/{userId}/results/{resultId}` (subcollection document)

| Field      | Type       | Required | Description                              |
|------------|------------|----------|------------------------------------------|
| resultId   | string     | Yes      | Auto-generated document ID               |
| userId     | string     | Yes      | Owning user's Firebase Auth UID          |
| createdAt  | timestamp  | Yes      | When agent run was initiated             |
| status     | string     | Yes      | `'processing'` | `'complete'` | `'error'` |
| locations  | map[]      | Yes      | Array of LocationResult objects          |

**Identity & uniqueness:** One result set per agent run. For MVP, only one result document per user (re-trigger blocked).

---

### `LocationResult` (embedded in locations array)

| Field          | Type     | Required | Description                                |
|----------------|----------|----------|--------------------------------------------|
| locationId     | string   | Yes      | Unique ID for this location                |
| city           | string   | Yes      | City name                                  |
| state          | string   | Yes      | US state abbreviation                      |
| overallFitScore | number  | Yes      | 0-100 fit score                            |
| highlightTags  | string[] | Yes      | Short descriptive tags                     |
| userAction     | string   | Yes      | `'none'` | `'saved'` | `'dismissed'`      |
| jobs           | map[]    | Yes      | Array of JobMatch objects (3-5 per city)   |
| living         | map      | Yes      | LivingDetails object                       |
| lifestyle      | map      | Yes      | LifestyleDetails object                    |
| context        | map      | Yes      | ContextDetails object                      |

---

### `JobMatch` (embedded)

| Field           | Type   | Required | Description                           |
|-----------------|--------|----------|---------------------------------------|
| title           | string | Yes      | Job title                             |
| company         | string | Yes      | Employer name                         |
| salaryRange     | map    | Yes      | `{ min: number, max: number }` (USD)  |
| fitScore        | number | Yes      | 0-100 match score                     |
| fitExplanation  | string | Yes      | Why this job matches the user         |
| applicationUrl  | string | Yes      | Link to apply                         |
| workStyle       | string | Yes      | `'remote'` | `'hybrid'` | `'in_person'` |

---

### `LivingDetails` (embedded)

| Field            | Type   | Required | Description                               |
|------------------|--------|----------|-------------------------------------------|
| costOfLivingIndex | number | Yes     | Relative to national avg (100 = average)  |
| medianRent1br    | number | Yes      | Median 1-bedroom rent (USD/month)         |
| medianRent2br    | number | Yes      | Median 2-bedroom rent (USD/month)         |
| housingListings  | map[]  | Yes      | Array of HousingListing objects           |
| sampleBudget     | map    | Yes      | MonthlyBudget breakdown                   |

### `HousingListing` (embedded)

| Field        | Type   | Required | Description              |
|--------------|--------|----------|--------------------------|
| title        | string | Yes      | Listing title            |
| price        | number | Yes      | Monthly rent (USD)       |
| bedrooms     | number | Yes      | Number of bedrooms       |
| url          | string | Yes      | Link to listing          |
| neighborhood | string | Yes      | Neighborhood name        |

### `MonthlyBudget` (embedded)

| Field           | Type   | Required | Description                    |
|-----------------|--------|----------|--------------------------------|
| rent            | number | Yes      | Monthly rent                   |
| groceries       | number | Yes      | Monthly groceries              |
| utilities       | number | Yes      | Monthly utilities              |
| transportation  | number | Yes      | Monthly transportation         |
| discretionary   | number | Yes      | Monthly discretionary spending |
| total           | number | Yes      | Sum of all expenses            |
| estimatedSalary | number | Yes      | Estimated monthly salary       |
| savingsRate     | number | Yes      | Percentage of salary saved     |

---

### `LifestyleDetails` (embedded)

| Field        | Type   | Required | Description                          |
|--------------|--------|----------|--------------------------------------|
| walkScore    | number | Yes      | Walk Score (0-100)                   |
| transitScore | number | Yes      | Transit Score (0-100)                |
| nearbyHobbies | map[] | Yes      | `{ name, type, distance }` entries   |
| foodScene    | string | Yes      | AI-generated food scene summary      |
| demographics | string | Yes      | AI-generated demographics summary    |

### `ContextDetails` (embedded)

| Field           | Type   | Required | Description                              |
|-----------------|--------|----------|------------------------------------------|
| recentNews      | map[]  | Yes      | `{ headline, source, url, date }` entries |
| politicalClimate | string | Yes     | AI-generated political climate summary   |
| weatherOverview | string | Yes      | AI-generated weather summary             |
| crimeIndex      | number | Yes      | Crime index value                        |

---

## Firebase Storage Structure

```
resumes/{userId}/resume.{pdf|docx}
resumes/{userId}/cover-letter.{pdf|docx}
```

**Access rules:** Only the owning user (matching `request.auth.uid`) can read/write their files.

---

## Firestore Security Rules (MVP)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Results subcollection — same ownership rule
      match /results/{resultId} {
        allow read: if request.auth != null && request.auth.uid == userId;
        // Write only from server (admin SDK) — no client writes to results
        allow write: if false;
      }
    }

    // Deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Note:** Agent results are written server-side using Firebase Admin SDK (which bypasses security rules). The `userAction` field (save/dismiss) is the exception — this needs a targeted rule allowing the client to update only that field:

```
match /users/{userId}/results/{resultId} {
  allow read: if request.auth != null && request.auth.uid == userId;
  // Allow client to update only userAction on location results
  allow update: if request.auth != null && request.auth.uid == userId
    && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['locations']);
}
```
