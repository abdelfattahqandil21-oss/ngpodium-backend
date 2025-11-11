# 📁 دليل رفع الصور - Upload Guide

## الهيكل:
```
uploads/
├── profile/     ← صور البروفايل
└── cover/       ← صور الكفر
```

---

## 🔐 Endpoints:

### 1. رفع صورة بروفايل:
```
POST /api/v1/upload/profile
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Body:
- file: [image file]
```

**Response:**
```json
{
  "filename": "profile-1731331234567-123456789.jpg",
  "url": "http://localhost:3000/uploads/profile/profile-1731331234567-123456789.jpg",
  "size": 245678,
  "mimetype": "image/jpeg"
}
```

---

### 2. رفع صورة كفر:
```
POST /api/v1/upload/cover
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Body:
- file: [image file]
```

**Response:**
```json
{
  "filename": "cover-1731331234567-987654321.jpg",
  "url": "http://localhost:3000/uploads/cover/cover-1731331234567-987654321.jpg",
  "size": 512345,
  "mimetype": "image/jpeg"
}
```

---

## ✅ القيود (Validation):

- **الأنواع المسموحة:** jpg, jpeg, png, gif, webp
- **الحجم الأقصى:** 5 MB
- **المصادقة:** JWT Token مطلوب

---

## 🌐 الوصول للصور:

الصور متاحة مباشرة عبر:
```
http://localhost:3000/uploads/profile/<filename>
http://localhost:3000/uploads/cover/<filename>
```

---

## 📝 مثال Angular:

```typescript
// upload.service.ts
uploadProfileImage(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  
  return this.http.post(
    `${environment.apiUrl}/upload/profile`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${this.authService.getAccessToken()}`
      }
    }
  );
}

// component.ts
onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.uploadService.uploadProfileImage(file).subscribe(
      response => {
        console.log('Image URL:', response.url);
        // احفظ الـ URL في البروفايل
      }
    );
  }
}
```

---

## 🔒 الأمان:

- ✅ JWT Authentication مطلوب
- ✅ File type validation
- ✅ File size limit (5MB)
- ✅ Unique filenames (timestamp + random)
- ✅ Separate folders للتنظيم

---

## 🚀 Production:

في الـ production، يُفضل:
1. استخدام CDN (Cloudinary, AWS S3)
2. أو nginx لخدمة الملفات الثابتة
3. تفعيل CORS للصور
4. إضافة image optimization

---

## 📦 Environment Variables:

```env
BASE_URL=http://localhost:3000
# في production:
# BASE_URL=https://yourdomain.com
```
