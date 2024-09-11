import { z } from 'zod';

export const bookingSchema = z.object({
    booking_type: z.enum(['booking', 'canceling', 'reschedule']).describe('The type of appointment'),
    name: z.string().min(1, "Name is required").optional().describe('The name of the customer'),
    contact: z.string().min(10, "Phone number is required").describe('The phone number of the customer'),
    date: z.string().min(1, "Date is required").optional().describe('The appointment date and time in format of MM-DD hh:mm tt'),
}).refine((data) => {
    if ((data.booking_type === 'booking' || data.booking_type === 'reschedule') && (!data.name || !data.date)) {
        return false;
    }
    if (data.booking_type === 'canceling' && !data.contact) {
        return false;
    }
    return true;
}, {
    message: "Missing required fields based on booking type",
    path: ['booking_type'],
});

export async function handleBooking(data: z.infer<typeof bookingSchema>) {
    const { booking_type, name, contact, date } = data;

    if (booking_type === 'booking') {
        return `Appointment booked for **${name}** on **${date}**. You can use your phone number(**${contact}**) to manage your appointment.`;
    } else if (booking_type === 'canceling') {
        return `Appointment canceled for ${name}.`;
    } else if (booking_type === 'reschedule') {
        return `Appointment rescheduled for ${name} on ${date}. You can use your phone number(**${contact}**) to manage your appointment.`;
    } else {
        throw new Error('Invalid booking type.');
    }
}
