import app from './app';
import { env } from './config/env';
import prisma from './config/database';

const PORT = env.PORT || 5000;

async function bootstrap() {
    try {
        await prisma.$connect();
        console.log('Successfully connected to Database');

        // Create hardcoded admin user if not exists
        await createHardcodedAdmin();

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
        const existingAdmin = await prisma.user.findFirst({
            where: { email: 'admin@medicare.uz' }
        });

        if (!existingAdmin) {
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            await prisma.user.create({
                data: {
                    phone: '+998901234567',
                    email: 'admin@medicare.uz',
                    passwordHash: hashedPassword,
                    firstName: 'Super',
                    lastName: 'Admin',
                    role: 'SUPER_ADMIN',
                },
            });
            
            console.log('✅ Hardcoded admin user created: admin@medicare.uz / admin123');
        } else {
            console.log('✅ Admin user already exists');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

bootstrap();
