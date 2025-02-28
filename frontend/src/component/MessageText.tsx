import useGetMessages from "../hooks/useGetMessages";
import { groupMessagesByDate } from "../utils/extractTime.ts";
import MessageTextSmall from "./MessageTextSmall";
import { formatDate } from "../utils/extractTime.ts"
import {MessageType, GroupedMessages} from "../types/types.ts";

function MessageText() {
  const { loading, messages } = useGetMessages(); 
  const groupedMessages = groupMessagesByDate(messages);
  

  return (
    <div>
      <div className="space-y-4 w-full">
        {loading ? (
          <svg className="svg_loading m-auto" viewBox="25 25 50 50">
            <circle className="svg_circle" r="20" cy="50" cx="50"></circle>
          </svg>
        ) : (
          ""
        )}
        {!loading && messages && messages.length === 0 && (
          <p className="text-center text-gray-500">Send a message to start the conversation</p>
        )}
        {!loading && messages && messages.length > 0 && (
          groupedMessages.map((group : GroupedMessages) => (
            <div key={group.date}>
              <div className="text-center text-gray-500 my-2">
                <small className='bg-blue-100 py-2 px-3 rounded-md'>
                {formatDate(group.date)}
                </small>
              </div>
              {group.messages.map((message: MessageType) => (
                <div key={message._id} >
                  <MessageTextSmall message={message} />
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MessageText;
