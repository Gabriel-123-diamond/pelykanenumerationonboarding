 1. Sign up or Log in with your account in the app.
   2. Go to your Firebase Console -> Firestore Database.
   3. Open the users collection and find the document that matches your UID (you can find your UID in the Authentication
      tab if unsure).
   4. Edit the document fields:
       * Change role to: admin
       * Set isApproved to: true
   5. Refresh the app, and you will automatically be redirected to the Bakery Control (Admin Dashboard).
