import { LoadingButton } from '@mui/lab';
import { Avatar, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import * as htmlToImage from 'html-to-image';
import { useState } from 'react';
import { PopupController } from 'types/Common';
import { DistributorRetailerOrderType } from 'types/Retailer';
import { formatTimeDate } from 'utils/common';
import fishBg from '../../../assets/images/fish-bg.jpg';
type PopupProps = PopupController & {
  item: DistributorRetailerOrderType;
};

const Stamp1 = ({ item }: { item: DistributorRetailerOrderType }) => {
  return (
    <div id='stamp1'>
      <div className='bg-primary-main h-20 w-72 rounded-t-3xl flex flex-col justify-center items-center font-bold text-white'>
        <div className='text-2xl'>Traceability stamp</div>
        <div className='text-base'>Using blockchain</div>
      </div>
      <div
        className='h-72 w-72 flex flex-col justify-center items-center  gap-5'
        style={{
          backgroundImage: `url('${fishBg}')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Avatar variant='square' src={item.qrCode} className='w-48 h-48 mb-4' />
      </div>
      <div className='bg-primary-main h-20 w-72 rounded-b-3xl p-3 flex justify-center'>
        <div className='text-white font-bold text-3xl p-2 rounded-2xl'>{item.speciesName}</div>
      </div>
    </div>
  );
};

const Stamp2 = ({ item }: { item: DistributorRetailerOrderType }) => {
  return (
    <div id='stamp2'>
      <div
        className='bg-primary-main rounded-t-3xl flex flex-col justify-center items-center font-bold text-white'
        style={{ width: '515px', height: '100px' }}
      >
        <div className='text-3xl'>Traceability stamp</div>
        <div className='text-lg'>Using blockchain</div>
      </div>
      <div
        className='flex flex-row justify-center items-center gap-5 rounded-b-3xl'
        style={{
          backgroundImage: `url('${fishBg}')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          width: '515px',
          height: '300px',
        }}
      >
        <div className='bg-white p-4 rounded-3xl'>
          <div className='flex flex-col items-start mb-5'>
            <div className='text-2xl font-bold'>{item.speciesName}</div>
            <div>Produced at {item.distributorId.fishProcessingId.fishProcessor.name}</div>
            <div>Lot Code: {item.distributorId.fishProcessingId.id}</div>
          </div>
          <div className='flex flex-row items-center justify-center gap-5'>
            <Avatar variant='square' src={item.qrCode} className='w-24 h-24' />
            <div className='flex flex-col'>
              <div>Date of processing: {formatTimeDate(item.dateOfProcessing)}</div>
              <div>Date of expiry: {formatTimeDate(item.dateOfExpiry)}</div>
              <div>Fillets in packet: {item.filletsInPacket} fillets</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SelectStampPopup = ({ item, onClose }: PopupProps) => {
  const [value, setValue] = useState('stamp1');
  const handleDownloadStamp = () => {
    htmlToImage.toJpeg(document.getElementById(value) as HTMLElement, { quality: 0.95 }).then(function (dataUrl) {
      let link = document.createElement('a');
      link.download = item.distributorId.fishProcessingId.id + '.jpg';
      link.href = dataUrl;
      link.click();
    });
  };
  const handleChangeStamp = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <>
      <DialogTitle>Stamp</DialogTitle>
      <DialogContent>
        <RadioGroup row name='position' defaultValue='top' onChange={handleChangeStamp} value={value}>
          <div className='w-full flex flex-row justify-center'>
            <FormControlLabel
              value='stamp1'
              control={<Radio />}
              label={<Stamp1 item={item} />}
              labelPlacement='top'
              className='w-full'
            />
            <FormControlLabel
              value='stamp2'
              control={<Radio />}
              label={<Stamp2 item={item} />}
              labelPlacement='top'
              className='w-full'
            />
          </div>
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <LoadingButton variant='outlined' color='inherit' onClick={onClose}>
          Cancel
        </LoadingButton>
        <LoadingButton variant='outlined' color='inherit' onClick={handleDownloadStamp}>
          Download
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default SelectStampPopup;
