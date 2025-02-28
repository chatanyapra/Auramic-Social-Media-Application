// utils/extractTime.ts
export const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = padZero(date.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = padZero(hours);
    return `${formattedHours}:${minutes} ${ampm}`;
};

function padZero(number: number): string {
    return number.toString().padStart(2, '0');
}
// ---------date format------------
export const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const today = new Date(); // Today's date

    // Check if the date is today
    if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    ) {
        return "Today";
    }

    // If not today, format the date normally
    const day = padZero(date.getDate());
    const month = getMonthName(date.getMonth());
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
};

function getMonthName(monthIndex: number): string {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
}

// utils/groupMessagesByDate.ts

interface MessageType {
    _id: string;
    message: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
}
interface GroupedMessages {
    date: string;
    messages: MessageType[];
}

export const groupMessagesByDate = (messages: MessageType[]): GroupedMessages[] => {
    const groupedMessages: { [key: string]: MessageType[] } = {};

    messages.forEach((message: MessageType) => {
        const messageDate = new Date(message.createdAt);
        const dateKey = `${messageDate.getFullYear()}-${padZero(messageDate.getMonth() + 1)}-${padZero(messageDate.getDate())}`;

        if (!groupedMessages[dateKey]) {
            groupedMessages[dateKey] = [];
        }

        groupedMessages[dateKey].push(message);
    });

    return Object.keys(groupedMessages).map((date: string) => ({
        date,
        messages: groupedMessages[date],
    }));
};
