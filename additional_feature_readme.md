# 📊 Additional Feature: Interactive Dashboard

**Student:** Lee Shang Hong (2400137B)  
**Course:** Full Stack Web Development - Temasek Polytechnic  
**Project:** Library Book Finder & Reservation System

## 📋 Feature description

The **Interactive Dashboard** will provide users with a comprehensive visual summary of their reservation activities. It displays real-time statistics and allows quick access to common actions.

### **What it does:**

- Displays total reservation count (all-time)
- Shows active reservations count (currently in progress)
- Shows completed reservations count (successfully picked up by user)
- Shows cancelled reservations count (user cancelled)
- Breaks down active reservations into:
  1. Ready for Pickup (books waiting at counter)
  2. In Queue (waiting for book to be returned)
- Provides quick action buttons:
  1. Search Books
  2. View All Reservations


## 🎯 Why did i implement this feature?

### **Problem it solves:**

1. **Lack of overview:** Users had to navigate through multiple pages to understand their reservation status
2. **No quick stats:** Users could not quickly see how many books they've reserved, picked up, or cancelled
3. **Poor UX:** No central place to access common actions

### **How it helps users:**

1. **At-a-glance overview:** See all statistics instantly without clicking through pages
2. **Status awareness:** Quickly know if any books are ready for pickup
3. **Informed decisions:** Understand borrowing patterns and activity history
4. **Quick navigation:** Access frequently used features directly from dashboard

### **Alignment with project purpose:**

The Library Book Finder aim is to make library book management efficient and user-friendly. The dashboard enhances this by providing users with immediate visibility into their library activity, reducing the time and effort needed to track reservations.

##  Technical Implementation

### **1. Frontend component**

**File:** `src/pages/DashboardPage.jsx`

```javascript
// Main state management
const [stats, setStats] = useState({
  totalReservations: 0,
  activeCount: 0,
  completedCount: 0,
  cancelledCount: 0,
  readyCount: 0,
  waitingCount: 0
});

// Fetch data from backend on component mount
useEffect(() => {
  loadDashboardData();
}, []);

// Load and calculate statistics
const loadDashboardData = async () => {
  setLoading(true);
  const data = await reservationService.getAllReservations();
  
  // Separate active and historical reservations
  const active = data.active || [];
  const history = data.history || [];
  const allReservations = [...active, ...history];
  
  // Calculate all statistics
  setStats({
    totalReservations: allReservations.length,
    activeCount: active.length,
    completedCount: history.filter(r => r.status === 'completed').length,
    cancelledCount: history.filter(r => r.status === 'cancelled').length,
    readyCount: active.filter(r => r.status === 'ready').length,
    waitingCount: active.filter(r => r.status === 'waiting').length
  });
  
  setLoading(false);
};
```

**Key implementation details:**

- **Async data fetching:** Use `async/await` to fetch reservation data from backend API
- **State management:** React `useState` hook manages component state
- **Side effects:** React `useEffect` hook triggers data loading when component mounts
- **Data processing:** Frontend calculate statistics by filtering and counting reservation documents
- **Loading states:** Shows loading spinner while fetching data for better UX
- **Error handling:** Gracefully handles API failures


### **2. Backend integration**

**API Endpoint used:** `GET /reservations`

**Endpoint implementation** (from `backend/routes/reservation.js`):

```javascript
router.get('/', async (req, res) => {
  try {
    // Fetch all reservations from MongoDB
    const reservations = await Reservation.find();
    
    // Categorize into active and history
    const active = reservations.filter(r => 
      r.status === 'ready' || r.status === 'waiting'
    );
    const history = reservations.filter(r => 
      r.status === 'completed' || r.status === 'cancelled'
    );
    
    // Return categorized data
    res.json({ active, history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

**How it works:**

1. Frontend calls `reservationService.getAllReservations()`
2. Service layer makes HTTP GET request to `http://localhost:5050/reservations`
3. Backend queries MongoDB using Mongoose: `Reservation.find()`
4. Backend filters reservations into active/history categories
5. Backend returns JSON response with categorized data
6. Frontend receives data and calculates statistics
7. Dashboard displays statistics in responsive grid layout

### **3. User interface design**

**Statistics grid:**

```jsx
<div className="stats-grid">
  <div className="stat-card total">
    <div className="stat-icon">📚</div>
    <div className="stat-content">
      <h2>{stats.totalReservations}</h2>
      <p>Total Reservations</p>
    </div>
  </div>
  {/* Similar cards for Active, Completed, Cancelled */}
</div>
```

**CSS implementation** (from `src/pages/css/DashboardPage.css`):

```css
/* Responsive grid layout */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
```

**Design features:**

- **Responsive grid:** it will adapt to different screen sizes (desktop, tablet, mobile)
- **Color coding:** Different colors for each statistic type for quick identification
- **Icons:** Visual indicators (📚, ⏳, ✅, ❌) for better comprehension
- **Hover effects:** Cards lift slightly on hover for interactive feel
- **Clear typography:** Large numbers with descriptive labels

##  Research & Learning Sources

### **1. React hooks documentation**
- **Source:** [React Official Documentation - useState](https://react.dev/reference/react/useState)
- **Source:** [React Official Documentation - useEffect](https://react.dev/reference/react/useEffect)
- **What i learned:** 
  - How to manage component state with useState
  - How to handle side effects like data fetching with useEffect
  - How to properly clean up effects and avoid memory leaks
  - Dependency arrays and when components re-render

### **2. Async javaScript & fetch API**
- **Source:** [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- **Source:** [MDN Web Docs - async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- **What i learned:**
  - How to make asynchronous HTTP requests
  - Using async/await for cleaner asynchronous code
  - Error handling with try-catch blocks
  - Promise-based API design patterns

### **3. Dashboard UI/UX design patterns**
- **Source:** [Dashboard Design Best Practices](https://www.interaction-design.org/literature/article/dashboard-design-considerations-and-best-practices)
- **Source:** [Data Visualization Principles](https://www.nngroup.com/articles/dashboard-design/)
- **What i learned:**
  - Importance of visual hierarchy in dashboards
  - Using color coding for quick data comprehension
  - Keeping statistics scannable and actionable
  - Providing context with labels and descriptions

### **4. CSS grid layout**
- **Source:** [MDN Web Docs - CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- **Source:** [CSS-Tricks - Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- **What i learned:**
  - Creating responsive grid layouts
  - Using auto-fit and minmax for flexible columns
  - Making layouts adapt to different screen sizes
  - Grid gap for consistent spacing

### **5. MongoDB aggregation & data processing**
- **Source:** [MongoDB Documentation - Find Operations](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/)
- **Source:** [Mongoose Documentation - Queries](https://mongoosejs.com/docs/queries.html)
- **What i learned:**
  - How to query MongoDB collections with Mongoose
  - Filtering documents based on field values
  - Processing query results in JavaScript
  - Categorizing data for frontend consumption


## 🔄 Integration with existing project

### **How dashboard connects to main app:**

1. **Uses existing API:**
   - Dashboard doesn't create new backend endpoints
   - Reuses `GET /reservations` endpoint from reservation management
   - Same data source as "My Reservations" page

2. **Shares database:**
   - Statistics reflect actual MongoDB data
   - No separate database or collection needed
   - Updates automatically when reservations change

3. **Consistent navigation:**
   - Accessible via bottom navigation bar
   - Part of main app routing structure
   - Follows same design patterns as other pages

4. **Connected user flow:**
   ```
   User reserves book → Active count increases in Dashboard
   User cancels reservation → Cancelled count increases
   User confirms pickup → Completed count increases
   ```

### **Not just an isolated page:**

The dashboard is **fully integrated** with the application's core functionality:

-  Real-time data from same MongoDB collections
-  Updates reflect user actions across the app
-  Uses same API service layer as other features
-  Provides navigation to other pages (Search, Reservations)
-  Part of the main bottom navigation flow
