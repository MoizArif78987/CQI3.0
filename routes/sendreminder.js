const express = require('express');
const router = express.Router();
const db = require('../database/database');
const { transporter } = require('../nodemailer/nodemailer');
const cron = require('node-cron');

// Function to get form IDs from the database
async function getFormIds() {
    const query = 'SELECT id FROM forms';
    const [formIds] = await db.query(query);
    return formIds.map(form => form.id);
}

// Function to get users who haven't filled out the form with matching category
async function getUsersWithoutResponses(formId) {
    const query = `
        SELECT DISTINCT u.ID, u.Name, u.Email
        FROM users u
        WHERE u.ID NOT IN (
            SELECT DISTINCT r.user_id
            FROM ratingresponses r
            WHERE r.form_id = ?
        ) AND u.Category IN (
            SELECT DISTINCT f.category
            FROM forms f
            WHERE f.id = ?
        );
    `;

    const [usersWithoutResponses] = await db.query(query, [formId, formId]);
    return usersWithoutResponses;
}


// Function to send reminders immediately
async function sendRemindersImmediately(formId) {
    try {
        // Get the list of users who haven't filled out the form
        const usersWithoutResponses = await getUsersWithoutResponses(formId);

        // Send reminders to each user
        for (const user of usersWithoutResponses) {
            const formLink = `http://localhost:3000/form/${formId}/${user.ID}`;
            const emailContent = `Reminder: Please fill out the form using the following link: ${formLink}`;
            
            // Send email reminder
            await sendReminderEmail(user.Email, 'Form Reminder', emailContent);

            // Log that the email has been sent
            console.log(`Email sent to ${user.Email}`);
        }

        console.log(`Reminders for form ${formId} sent successfully`);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Schedule the reminder for each form ID
async function scheduleReminders() {
    try {
        const formIds = await getFormIds();

        // Schedule reminders for each form
        formIds.forEach(formId => {
            cron.schedule('0 0 */2 * * *', () => {
                sendRemindersImmediately(formId);
            });
        });

        console.log('Reminders scheduled successfully');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Start scheduling reminders when the server starts
scheduleReminders();

// Function to send reminder email
async function sendReminderEmail(email, subject, content) {
    const mailOptions = {
        from: 'moizarif100@gmail.com', // Sender email
        to: email,
        subject: subject,
        text: content,
    };

    // Send email
    await transporter.sendMail(mailOptions);
}

module.exports = router;
