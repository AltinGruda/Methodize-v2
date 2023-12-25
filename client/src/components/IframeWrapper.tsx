import IframeComponent from "./IFrameComponent";

const IframeWrapper = ({ joinRoomName }: { joinRoomName: string }) => {
    return (
        <div className="flex">
            <IframeComponent joinRoomName={joinRoomName} />
        </div>
    )
};

export default IframeWrapper;