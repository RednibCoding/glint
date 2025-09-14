import { StatefulWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// TextField widget for text input
export class TextField extends StatefulWidget {
  constructor(props = {}) {
    super(props);
    this.state = { value: props.initialValue || '' };
  }

  build() {
    const {
      placeholder = '',
      onChanged,
      onSubmitted,
      obscureText = false,
      enabled = true,
      maxLength,
      style = {},
      ...otherProps
    } = this.props;

    const inputStyle = {
      padding: '12px 16px',
      fontSize: '16px',
      border: '2px solid #e1e5e9',
      borderRadius: '6px',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      backgroundColor: enabled ? '#ffffff' : '#f5f5f5',
      color: enabled ? '#333333' : '#999999',
      ...style
    };

    return new Element('input', {
      type: obscureText ? 'password' : 'text',
      placeholder,
      value: this.state.value,
      disabled: !enabled,
      maxLength,
      style: inputStyle,
      onInput: (e) => {
        const newValue = e.target.value;
        this.setState({ value: newValue });
        if (onChanged) onChanged(newValue);
      },
      onKeyPress: (e) => {
        if (e.key === 'Enter' && onSubmitted) {
          onSubmitted(this.state.value);
        }
      },
      onFocus: (e) => {
        e.target.style.borderColor = '#007bff';
      },
      onBlur: (e) => {
        e.target.style.borderColor = '#e1e5e9';
      },
      ...otherProps
    });
  }
}