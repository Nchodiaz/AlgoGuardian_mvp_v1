import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('asd123', 10);

    // 1. Plan Free User
    const freeUser = await prisma.user.upsert({
        where: { email: 'nchodiazg@gmail.com' },
        update: {
            password,
            plan: 'free',
            subscription_status: 'active'
        },
        create: {
            email: 'nchodiazg@gmail.com',
            password,
            plan: 'free',
            subscription_status: 'active'
        }
    });
    console.log('Free User upserted:', freeUser.email);

    // 2. Plan Premium User
    const premiumUser = await prisma.user.upsert({
        where: { email: 'ncho.trading@gmail' },
        update: {
            password,
            plan: 'premium',
            subscription_status: 'active'
        },
        create: {
            email: 'ncho.trading@gmail',
            password,
            plan: 'premium',
            subscription_status: 'active'
        }
    });
    console.log('Premium User upserted:', premiumUser.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
