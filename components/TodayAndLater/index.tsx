import React from 'react';
import { FormMapp } from 'serino-mapp-form';
import viewModel from './useViewModel';
import moment from 'moment';

interface ITodayAndLater {
  dataOut: any;
  dataIn?: {
    /** Value for sendDate field */
    date?: string;
    /** Value for sendTime field */
    time?: string;
    /** Campaign Schedule (now/later/recurring) */
    schedule?: string | { [key: string]: unknown };
  };
  disabled?: boolean;
}

const TodayAndLater = ({ dataIn, dataOut, disabled }: ITodayAndLater) => {
  const model = viewModel();
  const today = moment().format('MM/DD/YYYY');

  return (
    <FormMapp
      dataIn={{
        values: {
          'send-date': dataIn?.schedule === 'now' ? today : dataIn?.date,
          'send-time': dataIn?.time
            ? moment.utc(dataIn?.time).format('hh:mm A')
            : model?.roundUpToNearestQuarterHour(),
        },
        fields: [
          {
            name: 'send-date',
            label: 'Send Date',
            type: dataIn?.schedule === 'now' ? 'text' : 'date-picker',
            disabled: disabled || dataIn?.schedule === 'now',
          },
          {
            name: 'send-time',
            label: 'Send Time',
            type: 'autocomplete',
            disabled: disabled,
            disableClearable: true,
          },
        ],
        collections: {
          'send-time': [...model?.timeLoopEvery15min],
        },
        validations: null,
        onSubmit: model?.handleSubmit,
      }}
      dataOut={(formik?: { [key: string]: unknown }) => {
        dataOut(formik as { [key: string]: unknown });
      }}
    />
  );
};

export default TodayAndLater;
