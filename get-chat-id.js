const TELEGRAM_BOT_TOKEN = '8351042929:AAFb0fB6OwK5peG34Qr9tSkDrDz_ynptvP4';

async function getChatId() {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
        const data = await response.json();

        console.log('Updates:', JSON.stringify(data, null, 2));

        if (data.ok && data.result.length > 0) {
            console.log('\nChat IDs found:');
            data.result.forEach((update, index) => {
                if (update.message) {
                    console.log(`${index + 1}. Chat ID: ${update.message.chat.id}`);
                    console.log(`   From: ${update.message.from.first_name} ${update.message.from.last_name || ''}`);
                    console.log(`   Username: @${update.message.from.username || 'N/A'}`);
                    console.log(`   Message: ${update.message.text}`);
                    console.log('---');
                }
            });
        } else {
            console.log('No updates found. Send a message to your bot first.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

getChatId(); 