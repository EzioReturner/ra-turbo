import React, { PureComponent } from 'react';
import { CheckPermission } from './CheckPermission';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types'

@inject('userStore')
class Authorized extends PureComponent {
	render() {
		const { children, routeAuthority, unidentified, userStore } = this.props;
		const _children = typeof children === 'undefined' ? null : children;
		const currentAuthority = userStore.authority;
		return CheckPermission(
			routeAuthority,
			currentAuthority,
			_children,
			unidentified
		);
	}
}

Authorized.propTypes = {
	routeAuthority: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.string),
		PropTypes.string
	]),
	unidentified: PropTypes.node,
}

export default Authorized;
