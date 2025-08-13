# 🧪 Manual E2E Test Guide

## Prerequisites
- App running on http://localhost:3000
- Backend API running and accessible
- Browser with DevTools open

## Test Steps

### 1. **Navigate to Dashboard**
```
URL: http://localhost:3000/dashboard
```

### 2. **Open Browser DevTools**
- Press F12
- Go to Console tab
- Clear console logs

### 3. **Check Initial State**

**Look for debug logs:**
```
🔍 HomePage Debug: {
  kindle_email: "...",
  acknowledged_mail_whitelisting: "...",
  hasKindleSetup: true/false,
  shouldShowInfoUpdate: true/false
}
```

**Visual Check:**
- [ ] InfoUpdateBox visible (orange border box)
- [ ] DeviceSetup visible (multi-step setup)
- [ ] ConversionScreen visible (main dashboard with URL input)

### 4. **Test Onboarding Flow (if InfoUpdateBox is visible)**

**Step 4a: Fill Kindle Email**
- Find input with placeholder containing "kindle"
- Enter: `testuser`
- Should auto-append `@kindle.com`

**Step 4b: Fill Acknowledgment**
- Find input with placeholder "Type YES to confirm..."
- Enter: `YES`

**Step 4c: Submit Form**
- Click "Connect Kindle" button
- Watch console for:
  ```
  🔍 InfoUpdateBox: API call successful, refreshing profile...
  🔍 InfoUpdateBox: Profile refreshed, calling onComplete...
  🔍 HomePage: handleInfoUpdateComplete called, setting showInfoUpdate to false
  ```

**Step 4d: Check Backend Logs**
- Should see: `POST /api/v1/user/info-update`
- Should see: `GET /api/v1/auth/me` (refresh call)

**Step 4e: Verify State Change**
- InfoUpdateBox should disappear
- ConversionScreen should appear
- Debug log should show: `shouldShowInfoUpdate: false`

### 5. **Test API Call Count**

**Refresh the page and check backend logs:**
- Should see only **1 call** to `/api/v1/auth/me`
- Should NOT see multiple duplicate calls

### 6. **Test Conversion Screen (if visible)**

**Check elements:**
- [ ] URL input field visible
- [ ] "Quick Send" section visible
- [ ] User greeting with name and emoji
- [ ] No console errors

## Expected Results

### ✅ Success Criteria
1. **Single API calls**: Only 1 call per endpoint on page load
2. **No image errors**: Google avatar loads without errors
3. **Onboarding works**: Form submission hides onboarding and shows main screen
4. **State persistence**: After successful setup, page shows conversion screen on refresh
5. **No console errors**: Clean console with only debug logs

### ❌ Failure Indicators
1. **Multiple API calls**: 5+ calls to same endpoint
2. **Image errors**: "hostname not configured" errors
3. **Onboarding loop**: Form submission doesn't hide onboarding
4. **Console errors**: Red error messages in console
5. **Blank screen**: No recognizable UI elements

## Debug Information

### Console Logs to Look For
```
🔍 HomePage Debug: {...}  // Shows current state
🔍 InfoUpdateBox: API call successful...  // Form submission
🔍 HomePage: handleInfoUpdateComplete called...  // State change
📡 API Request: POST /api/v1/user/info-update  // Network activity
📡 API Response: 200 /api/v1/user/info-update  // API success
```

### Backend Logs to Monitor
```
INFO: GET /api/v1/auth/me HTTP/1.1 200 OK
INFO: POST /api/v1/user/info-update HTTP/1.1 200 OK
```

## Troubleshooting

### If Onboarding Doesn't Disappear
1. Check console for API errors
2. Verify backend is returning updated user data
3. Check if `hasKindleSetup` becomes `true` in debug logs

### If Multiple API Calls
1. Verify React Strict Mode is disabled in next.config.ts
2. Check if multiple components are calling useUserProfile

### If Image Errors
1. Verify next.config.ts has Google domains configured
2. Check if regular img tag is being used instead of Next/Image
