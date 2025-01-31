import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';
import {
  Label,
} from '@folio/stripes/components';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { withStripes } from '@folio/stripes/core';
import { validate } from '../components/util';

const columnMapping = {
  nameReason: (
    <Label
      tagName="span"
      required
    >
      <FormattedMessage id="ui-users.refunds.columns.nameReason" />
    </Label>
  ),
  description: <FormattedMessage id="ui-users.refunds.columns.description" />,
};

class RefundReasonsSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { intl, stripes } = this.props;
    const label = intl.formatMessage({ id: 'ui-users.refunds.singular' });
    const editable = stripes.hasPerm('ui-users.settings.refunds.all');

    return (
      <this.connectedControlledVocab
        {...this.props}
        validate={(item, index, items) => validate(item, index, items, 'nameReason', label)}
        baseUrl="refunds"
        records="refunds"
        label={intl.formatMessage({ id: 'ui-users.refunds.label' })}
        labelSingular={label}
        objectLabel=""
        visibleFields={['nameReason', 'description']}
        columnMapping={columnMapping}
        nameKey="refund"
        hiddenFields={['numberOfObjects']}
        id="settings-refunds"
        sortby="nameReason"
        editable={editable}
      />
    );
  }
}

export default injectIntl(withStripes(RefundReasonsSettings));
