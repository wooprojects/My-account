// توابع کمکی برای کار با localStorage (به عنوان جایگزین برای فایل users.json)
// در محیط GitHub Pages نمی‌توان مستقیماً در فایل JSON نوشت، بنابراین از localStorage استفاده می‌کنیم

// دریافت کاربران از localStorage
function getUsers() {
    const usersJSON = localStorage.getItem('users');
    return usersJSON ? JSON.parse(usersJSON) : [];
}

// ذخیره کاربران در localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// بررسی اینکه آیا کاربر لاگین کرده است
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// دریافت کاربر فعلی
function getCurrentUser() {
    const userJSON = localStorage.getItem('currentUser');
    return userJSON ? JSON.parse(userJSON) : null;
}

// ثبت‌نام کاربر جدید
function signup(name, email, password) {
    const users = getUsers();
    
    // بررسی اینکه آیا کاربر با این ایمیل قبلاً ثبت‌نام کرده است
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return { success: false, message: 'این ایمیل قبلاً ثبت‌نام کرده است' };
    }
    
    // ایجاد کاربر جدید
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password // در حالت واقعی باید رمز عبور هش شود
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return { success: true, message: 'ثبت‌نام با موفقیت انجام شد' };
}

// ورود کاربر
function login(email, password) {
    const users = getUsers();
    
    // پیدا کردن کاربر با ایمیل و رمز عبور مطابقت
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // ذخیره کاربر فعلی در localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, message: 'ورود موفقیت‌آمیز بود' };
    } else {
        return { success: false, message: 'ایمیل یا رمز عبور نادرست است' };
    }
}

// خروج کاربر
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// مدیریت فرم ثبت‌نام
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // اعتبارسنجی
        if (password !== confirmPassword) {
            alert('رمز عبور و تکرار آن مطابقت ندارند');
            return;
        }
        
        if (password.length < 6) {
            alert('رمز عبور باید حداقل ۶ کاراکتر باشد');
            return;
        }
        
        // ثبت‌نام کاربر
        const result = signup(name, email, password);
        
        if (result.success) {
            alert(result.message);
            window.location.href = 'login.html';
        } else {
            alert(result.message);
        }
    });
}

// مدیریت فرم ورود
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // ورود کاربر
        const result = login(email, password);
        
        if (result.success) {
            alert(result.message);
            window.location.href = 'dashboard.html';
        } else {
            alert(result.message);
        }
    });
}

// مدیریت خروج
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', function() {
        logout();
    });
}

// نمایش پیام خوش‌آمدگویی در داشبورد
if (document.getElementById('welcomeMessage')) {
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('welcomeMessage').textContent = `خوش آمدید ${currentUser.name}!`;
    } else {
        // اگر کاربر لاگین نکرده باشد، به صفحه ورود هدایت می‌شود
        window.location.href = 'login.html';
    }
}

// بررسی وضعیت ورود کاربر در صفحاتی که نیاز به لاگین دارند
if (window.location.pathname.includes('dashboard.html') && !isLoggedIn()) {
    window.location.href = 'login.html';
  }
