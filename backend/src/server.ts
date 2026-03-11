import app from './app';
import { env } from './config/env';
import prisma from './config/database';

const PORT = env.PORT || 5000;

async function bootstrap() {
    try {
        await prisma.$connect();
        console.log('Successfully connected to Database');

        // Create hardcoded admin user if not exists (with timeout)
        try {
            await Promise.race([
                createHardcodedAdmin(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Admin creation timeout')), 30000)
                )
            ]);
        } catch (adminError) {
            console.error('⚠️ Admin creation failed:', adminError instanceof Error ? adminError.message : String(adminError));
            console.log('🚀 Continuing server startup anyway...');
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

async function createHardcodedAdmin() {
    try {
        console.log('🔍 Checking for existing admin user...');

        const existingAdmin = await prisma.user.findFirst({
            where: { email: 'admin@medicare.uz' }
        });

        console.log('📊 Existing admin found:', existingAdmin ? 'YES' : 'NO');

        if (!existingAdmin) {
            console.log('🔧 Creating new admin user...');
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('admin123', 10);

            console.log('🔐 Password hashed, creating user in database...');

            const newAdmin = await prisma.user.create({
                data: {
                    phone: '+998901234567',
                    email: 'admin@medicare.uz',
                    passwordHash: hashedPassword,
                    firstName: 'Super',
                    lastName: 'Admin',
                    role: 'SUPER_ADMIN',
                },
            });

            console.log('✅ Hardcoded admin user created successfully!');
            console.log('📧 Email:', newAdmin.email);
            console.log('👤 Name:', newAdmin.firstName, newAdmin.lastName);
            console.log('🔑 Role:', newAdmin.role);
            console.log('🆔 User ID:', newAdmin.id);
        } else {
            console.log('✅ Admin user already exists');
            console.log('📧 Email:', existingAdmin.email);
            console.log('🆔 User ID:', existingAdmin.id);
        }
    } catch (error) {
        console.error('❌ Error creating admin user:', error instanceof Error ? error.message : String(error));
        console.error('📄 Full error details:', error instanceof Error ? error.message : String(error));
    }
}

bootstrap();
