type PopupProps = {
  content: string;
  backgroundColor: string;
};

const ProcessStatus = ({ content, backgroundColor }: PopupProps) => {
  return (
    <>
      <div
        className='flex items-center justify-center h-8 rounded-md cursor-pointer p-3'
        style={{ backgroundColor: backgroundColor }}
      >
        <span className='text-xs font-medium text-white'>{content}</span>
      </div>
    </>
  );
};

export default ProcessStatus;
