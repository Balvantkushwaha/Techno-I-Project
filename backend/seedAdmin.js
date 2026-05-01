import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User, { userRoles } from './modules/userAuth/auth.model.js';
import connectDB from './config/db.js';
import { hashPassword } from './utils/password.util.js';

dotenv.config();

// Admin data
const adminData = [
    {
        firstName: 'Super',
        lastName: 'Admin',
        mobile: '9876543210',  // Super Admin mobile
        email: 'superadmin@example.com',
        password: 'SuperAdmin@123',
        role: userRoles.SUPER_ADMIN,
        isVerified: true
    },
    {
        firstName: 'Admin',
        lastName: 'User',
        mobile: '9876543211',  // Admin mobile
        email: 'admin@example.com',
        password: 'Admin@123',
        role: userRoles.ADMIN,
        isVerified: true
    }
];

// Main seeder function
const seedAdmins = async () => {
    try {
        // Connect to MongoDB
        // await mongoose.connect(process.env.MONGO_URI);
        // console.log('✅ Connected to MongoDB');
        // Connect to Database
        connectDB();

        for (const admin of adminData) {
            // Check if admin already exists
            const existingAdmin = await User.findOne({ 
                $or: [
                    { mobile: admin.mobile },
                    { email: admin.email }
                ]
            });

            if (existingAdmin) {
                console.log(`⚠️ Admin with mobile ${admin.mobile} already exists. Updating role...`);
                // Update role if exists
                await User.updateOne(
                    { mobile: admin.mobile },
                    { 
                        $set: { 
                            role: admin.role,
                            isVerified: true
                        }
                    }
                );
                console.log(`✅ Updated ${admin.firstName} ${admin.lastName} to ${admin.role}`);
            } else {
                // Create new admin
                const hashedPassword = await hashPassword(admin.password);
                const newAdmin = new User({
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    mobile: admin.mobile,
                    email: admin.email,
                    password: hashedPassword,
                    role: admin.role,
                    isVerified: admin.isVerified
                });
                
                await newAdmin.save();
                console.log(`✅ Created ${admin.role}: ${admin.firstName} ${admin.lastName} (${admin.mobile})`);
            }
        }

        console.log('\n🎉 Admin seeding completed!');
        console.log('📝 Login Credentials:');
        // console.log('Super Admin: 9876543210 / SuperAdmin@123');
        // console.log('Admin: 9876543211 / Admin@123');
        
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Error seeding admins:', error);
        process.exit(1);
    }
};

// Run seeder
seedAdmins();