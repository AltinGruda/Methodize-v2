import { FieldValues } from 'react-hook-form'

interface IframeComponentProps {
    joinRoomName: FieldValues | string;
  }
  
const IframeComponent: React.FC<IframeComponentProps> = ({ joinRoomName }) => {
  const iframeUrl = `https://taskmanager-team.daily.co/${joinRoomName}`;
  return (
    <div className='flex'>
      <iframe
        title="Video Call"
        style={{
          position: "absolute",
          width: "100%",
          maxWidth: "80%", // Adjust as needed
          height: "100%",
          maxHeight: "100%", // Adjust as needed
          border: "0",
          zIndex: 9999
        }}
        allow="camera;microphone"
        src={iframeUrl}
      />
    </div>
  );
};
  
  export default IframeComponent;
  