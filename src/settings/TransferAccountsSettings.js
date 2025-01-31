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
import { stripesConnect, withStripes } from '@folio/stripes/core';
import { validate } from '../components/util';
import { Owners } from './FeeFinesTable';

const columnMapping = {
  accountName: (
    <Label
      tagName="span"
      required
    >
      <FormattedMessage id="ui-users.transfers.columns.name" />
    </Label>
  ),
  desc: <FormattedMessage id="ui-users.transfers.columns.desc" />,
};

class TransferAccountsSettings extends React.Component {
  static manifest = Object.freeze({
    owners: {
      type: 'okapi',
      records: 'owners',
      path: 'owners?query=cql.allRecords=1 sortby owner&limit=500',
      accumulate: 'true',
    },
  });

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.object.isRequired,
    mutator: PropTypes.shape({
      owners: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      ownerId: '',
      owners: [],
    };

    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
    this.onChangeOwner = this.onChangeOwner.bind(this);
  }

  componentDidMount() {
    this.props.mutator.owners.reset();
    this.props.mutator.owners.GET().then(records => {
      const ownerId = (records.length > 0) ? records[0].id : '';
      this.setState({ owners: records, ownerId });
    });
  }

  onChangeOwner(e) {
    const ownerId = e.target.value;
    this.setState({ ownerId });
  }

  render() {
    const { intl: { formatMessage }, stripes } = this.props;
    const {
      ownerId,
      owners
    } = this.state;
    const label = formatMessage({ id: 'ui-users.transfers.singular' });

    const preCreateHook = (item) => {
      item.ownerId = ownerId;
      return item;
    };

    const hasCreatePerm = stripes.hasPerm('transfers.item.post');
    const hasEditPerm = stripes.hasPerm('transfers.item.put');
    const hasDeletePerm = stripes.hasPerm('transfers.item.delete');

    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="transfers"
        columnMapping={columnMapping}
        hiddenFields={['numberOfObjects']}
        id="settings-transfers"
        label={formatMessage({ id: 'ui-users.transfers.label' })}
        labelSingular={label}
        nameKey="transfer"
        objectLabel=""
        preCreateHook={preCreateHook}
        records="transfers"
        rowFilter={<Owners dataOptions={owners} onChange={this.onChangeOwner} />}
        rowFilterFunction={(item) => (item.ownerId === ownerId)}
        sortby="accountName"
        validate={(item, index, items) => validate(item, index, items, 'accountName', label)}
        visibleFields={['accountName', 'desc']}
        canCreate={hasCreatePerm}
        actionSuppressor={{
          edit: _ => !hasEditPerm,
          delete: _ => !hasDeletePerm,
        }}
      />
    );
  }
}

export default injectIntl(withStripes(stripesConnect(TransferAccountsSettings)));
