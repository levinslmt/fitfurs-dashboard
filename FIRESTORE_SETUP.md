# Firestore Database Setup Guide

## Step 1: Go to Firebase Console

1. Open https://console.firebase.google.com/
2. Select your project: **fitfurs-admin**
3. Click on **Firestore Database** (left sidebar)

---

## Step 2: Create Collections & Add Sample Data

### **Collection 1: USERS**

**Create Collection:**
1. Click **+ Create Collection**
2. Name it: `users`
3. Click **Create**

**Add Sample Documents:**

Click **+ Add Document** and add these records (click Auto ID for document ID):

**Document 1:**
```
Field: name → Type: String → Value: John Doe
Field: email → Type: String → Value: john@example.com
Field: phone → Type: String → Value: +1 (555) 123-4567
Field: status → Type: String → Value: active
Field: createdAt → Type: Timestamp → Click "Server timestamp" button (appears after selecting timestamp)
Field: updatedAt → Type: Timestamp → Click "Server timestamp" button (appears after selecting timestamp)
```

**Document 2:**
```
Field: name → Type: String → Value: Sarah Smith
Field: email → Type: String → Value: sarah@example.com
Field: phone → Type: String → Value: +1 (555) 234-5678
Field: status → Type: String → Value: active
Field: createdAt → Type: Timestamp → Click "Server timestamp" button
Field: updatedAt → Type: Timestamp → Click "Server timestamp" button
```

**Document 3:**
```
Field: name → Type: String → Value: Mike Johnson
Field: email → Type: String → Value: mike@example.com
Field: phone → Type: String → Value: +1 (555) 345-6789
Field: status → Type: String → Value: inactive
Field: createdAt → Type: Timestamp → Click "Server timestamp" button
Field: updatedAt → Type: Timestamp → Click "Server timestamp" button
```

---

### **Collection 2: PETS**

**Create Collection:**
1. Click **+ Create Collection**
2. Name it: `pets`
3. Click **Create**

**Add Sample Documents:**

**Document 1:**
```
Field: name → Type: String → Value: Buddy
Field: type → Type: String → Value: dog
Field: breed → Type: String → Value: Golden Retriever
Field: owner → Type: String → Value: John Doe
Field: age → Type: Number → Value: 3
Field: status → Type: String → Value: active
Field: imageUrl → Type: String → Value: https://images.unsplash.com/photo-1633722715463-d30628cbc4c1?w=400
Field: createdAt → Type: Timestamp → Value: (Server timestamp)
Field: updatedAt → Type: Timestamp → Value: (Server timestamp)
```

**Document 2:**
```
Field: name → Type: String → Value: Whiskers
Field: type → Type: String → Value: cat
Field: breed → Type: String → Value: Persian
Field: owner → Type: String → Value: Sarah Smith
Field: age → Type: Number → Value: 2
Field: status → Type: String → Value: active
Field: imageUrl → Type: String → Value: https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400
Field: createdAt → Type: Timestamp → Value: (Server timestamp)
Field: updatedAt → Type: Timestamp → Value: (Server timestamp)
```

**Document 3:**
```
Field: name → Type: String → Value: Max
Field: type → Type: String → Value: dog
Field: breed → Type: String → Value: German Shepherd
Field: owner → Type: String → Value: Mike Johnson
Field: age → Type: Number → Value: 5
Field: status → Type: String → Value: active
Field: imageUrl → Type: String → Value: https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400
Field: createdAt → Type: Timestamp → Value: (Server timestamp)
Field: updatedAt → Type: Timestamp → Value: (Server timestamp)
```

**Document 4:**
```
Field: name → Type: String → Value: Tweety
Field: type → Type: String → Value: bird
Field: breed → Type: String → Value: Parrot
Field: owner → Type: String → Value: John Doe
Field: age → Type: Number → Value: 1
Field: status → Type: String → Value: active
Field: imageUrl → Type: String → Value: https://images.unsplash.com/photo-1444464666175-1c6da79ec169?w=400
Field: createdAt → Type: Timestamp → Value: (Server timestamp)
Field: updatedAt → Type: Timestamp → Value: (Server timestamp)
```

---

### **Collection 3: APPOINTMENTS**

**Create Collection:**
1. Click **+ Create Collection**
2. Name it: `appointments`
3. Click **Create**

**Add Sample Documents:**

**Document 1:**
```
Field: petName → Type: String → Value: Buddy
Field: ownerName → Type: String → Value: John Doe
Field: service → Type: String → Value: grooming
Field: date → Type: String → Value: 2026-05-25
Field: time → Type: String → Value: 14:30
Field: status → Type: String → Value: pending
Field: notes → Type: String → Value: Allergic to cedar shavings
Field: createdAt → Type: Timestamp → Value: (Server timestamp)
Field: updatedAt → Type: Timestamp → Value: (Server timestamp)
```

**Document 2:**
```
Field: petName → Type: String → Value: Whiskers
Field: ownerName → Type: String → Value: Sarah Smith
Field: service → Type: String → Value: checkup
Field: date → Type: String → Value: 2026-05-26
Field: time → Type: String → Value: 10:00
Field: status → Type: String → Value: confirmed
Field: notes → Type: String → Value: Annual checkup
Field: createdAt → Type: Timestamp → Value: (Server timestamp)
Field: updatedAt → Type: Timestamp → Value: (Server timestamp)
```

**Document 3:**
```
Field: petName → Type: String → Value: Max
Field: ownerName → Type: String → Value: Mike Johnson
Field: service → Type: String → Value: vaccination
Field: date → Type: String → Value: 2026-05-27
Field: time → Type: String → Value: 15:00
Field: status → Type: String → Value: pending
Field: notes → Type: String → Value: Rabies vaccination due
Field: createdAt → Type: Timestamp → Value: (Server timestamp)
Field: updatedAt → Type: Timestamp → Value: (Server timestamp)
```

**Document 4:**
```
Field: petName → Type: String → Value: Buddy
Field: ownerName → Type: String → Value: John Doe
Field: service → Type: String → Value: training
Field: date → Type: String → Value: 2026-05-20
Field: time → Type: String → Value: 09:00
Field: status → Type: String → Value: completed
Field: notes → Type: String → Value: Basic obedience completed
Field: createdAt → Type: Timestamp → Value: (Server timestamp)
Field: updatedAt → Type: Timestamp → Value: (Server timestamp)
```

**Document 5:**
```
Field: petName → Type: String → Value: Tweety
Field: ownerName → Type: String → Value: John Doe
Field: service → Type: String → Value: checkup
Field: date → Type: String → Value: 2026-05-21
Field: time → Type: String → Value: 11:30
Field: status → Type: String → Value: completed
Field: notes → Type: String → Value: Health check passed
Field: createdAt → Type: Timestamp → Value: (Server timestamp)
Field: updatedAt → Type: Timestamp → Value: (Server timestamp)
```

---

## Step 3: Set Firestore Security Rules

Go to **Firestore Database** → **Rules** tab and paste this:

```json
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone authenticated can read/write users
    match /users/{userId} {
      allow read, write: if request.auth.uid != null;
    }
    
    // Anyone authenticated can read/write pets
    match /pets/{petId} {
      allow read, write: if request.auth.uid != null;
    }
    
    // Anyone authenticated can read/write appointments
    match /appointments/{appointmentId} {
      allow read, write: if request.auth.uid != null;
    }
  }
}
```

Click **Publish** to save.

---

## Step 4: Create Test User in Firebase Auth

1. Go to **Authentication** (left sidebar)
2. Click **Users** tab
3. Click **+ Create user**
4. Enter:
   - Email: `demo@fitfurs.com`
   - Password: `demo123456`
5. Click **Create user**

---

## Step 5: Test the Dashboard

1. Run your React app: `npm run dev`
2. Go to `http://localhost:5173`
3. Login with:
   - Email: `demo@fitfurs.com`
   - Password: `demo123456`

You should see:
- ✅ 3 users on dashboard
- ✅ 4 pets on dashboard
- ✅ 5 appointments on dashboard
- ✅ Charts updated with real data

---

## How to Add More Data

### From React Dashboard:
1. Click **Add User** / **Add Pet** / **New Appointment**
2. Fill in the form
3. Click **Create**
4. Data automatically saves to Firestore ✅

### From Kotlin App:
Use this code pattern:

```kotlin
val userData = hashMapOf(
    "name" to "John",
    "email" to "john@example.com",
    "phone" to "+1234567890",
    "status" to "active",
    "createdAt" to Timestamp.now(),
    "updatedAt" to Timestamp.now()
)
db.collection("users").add(userData)
```

---

## Real-Time Sync

Once data is in Firestore:
- **React Dashboard** watches for changes with `onSnapshot()`
- **Kotlin App** can also use `addSnapshotListener()`
- **Both automatically update** when data changes ✨

---

## Troubleshooting

**"No data showing in dashboard?"**
- ✅ Check Firestore console - data should be visible there first
- ✅ Make sure user is authenticated
- ✅ Check browser console for errors (F12 → Console)

**"Can't create data from React app?"**
- ✅ Make sure you're logged in
- ✅ Check Firebase security rules (should allow authenticated users)

**"Dashboard shows loading forever?"**
- ✅ Check Firebase connection in console
- ✅ Verify firebase.js config is correct
- ✅ Check network tab (F12 → Network) for errors
