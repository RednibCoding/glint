import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// ListTile widget for list items
export class ListTile extends StatelessWidget {
  constructor(props = {}) {
    super(props);
  }

  build() {
    const {
      leading,
      title = '',
      subtitle = '',
      trailing,
      onTap,
      selected = false,
      enabled = true,
      contentPadding = '16px',
      style = {},
      ...otherProps
    } = this.props;

    const tileStyle = {
      display: 'flex',
      alignItems: 'center',
      padding: typeof contentPadding === 'number' ? `${contentPadding}px` : contentPadding,
      cursor: enabled && onTap ? 'pointer' : 'default',
      backgroundColor: selected ? '#f0f8ff' : 'transparent',
      opacity: enabled ? 1 : 0.6,
      transition: 'background-color 0.2s',
      minHeight: '48px',
      ...style
    };

    const leadingStyle = {
      marginRight: '16px',
      minWidth: '40px'
    };

    const contentStyle = {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    };

    const titleStyle = {
      fontSize: '16px',
      fontWeight: '400',
      margin: 0,
      color: '#212121'
    };

    const subtitleStyle = {
      fontSize: '14px',
      color: '#757575',
      margin: '2px 0 0 0'
    };

    const trailingStyle = {
      marginLeft: '16px'
    };

    const content = [
      ...(leading ? [new Element('div', { style: leadingStyle }, [leading])] : []),
      new Element('div', { style: contentStyle }, [
        new Element('div', { style: titleStyle }, [title]),
        ...(subtitle ? [new Element('div', { style: subtitleStyle }, [subtitle])] : [])
      ]),
      ...(trailing ? [new Element('div', { style: trailingStyle }, [trailing])] : [])
    ];

    return new Element('div', {
      style: tileStyle,
      onClick: enabled && onTap ? onTap : undefined,
      onMouseEnter: enabled && onTap ? (e) => {
        e.target.style.backgroundColor = selected ? '#e3f2fd' : '#f5f5f5';
      } : undefined,
      onMouseLeave: enabled && onTap ? (e) => {
        e.target.style.backgroundColor = selected ? '#f0f8ff' : 'transparent';
      } : undefined,
      ...otherProps
    }, content);
  }
}