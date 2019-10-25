import React from 'react';
import {renderHook} from 'react-hooks-testing-library';
import {useLabel} from '../';

describe('useLabel hook', () => {
  let renderLabelHook = (labelProps, labelledComponentProps) => {
    let {result} = renderHook(() => useLabel(labelProps, labelledComponentProps));
    return result.current;
  };

  // Scenario is user doesn't want to handle aria labeling at all for label and component to be labeled
  it('should return autogenerated labelAriaProps/labelledComponentAriaProps if no props are provided', () => {
    let {labelAriaProps, labelledComponentAriaProps} = renderLabelHook();
    expect(labelAriaProps.id).toBe(labelledComponentAriaProps['aria-labelledby']);
    expect(labelAriaProps.htmlFor).toBe(labelledComponentAriaProps.id);
    expect(labelAriaProps.id).toBeDefined();
    expect(labelledComponentAriaProps.id).toBeDefined();
    // check that generated ids are unique
    expect(labelAriaProps.id).not.toBe(labelledComponentAriaProps.id);
  });

  it('should return correct labelAriaProps/labelledComponentAriaProps if only label id is provided', () => {
    let labelProps = {
      id: 'blah'
    };
    
    let {labelAriaProps, labelledComponentAriaProps} = renderLabelHook(labelProps);
    expect(labelAriaProps.id).toBe(labelledComponentAriaProps['aria-labelledby']);
    expect(labelAriaProps.htmlFor).toBe(labelledComponentAriaProps.id);
    expect(labelAriaProps.id).toBe(labelProps.id);
    expect(labelledComponentAriaProps.id).toBeDefined();
  });

  it('should return correct labelAriaProps/labelledComponentAriaProps if only labelFor is provided', () => {
    let labelProps = {
      labelFor: 'label'
    };
    
    let {labelAriaProps, labelledComponentAriaProps} = renderLabelHook(labelProps);
    expect(labelAriaProps.id).toBe(labelledComponentAriaProps['aria-labelledby']);
    expect(labelAriaProps.htmlFor).toBe(labelProps.labelFor);
    expect(labelAriaProps.id).toBeDefined();
    expect(labelledComponentAriaProps.id).toBeDefined();
  });

  it('should return correct labelAriaProps/labelledComponentAriaProps if only the labelee\'s id is provided', () => {
    let labelledComponentProps = {
      id: 'blah2'
    };
    
    let {labelAriaProps, labelledComponentAriaProps} = renderLabelHook({}, labelledComponentProps);
    expect(labelAriaProps.id).toBe(labelledComponentAriaProps['aria-labelledby']);
    expect(labelAriaProps.htmlFor).toBe(labelledComponentProps.id);
    expect(labelAriaProps.id).toBeDefined();
    expect(labelledComponentAriaProps.id).toBe(labelledComponentProps.id);
  });

  it('should return correct labelAriaProps/labelledComponentAriaProps if only the labelee\'s aria-labelledby is provided', () => {
    let labelledComponentProps = {
      'aria-labelledby': 'blah1'
    };
    
    let {labelAriaProps, labelledComponentAriaProps} = renderLabelHook({}, labelledComponentProps);
    expect(labelAriaProps.id).toBeDefined();
    expect(labelledComponentAriaProps.id).toBeDefined();
    expect(labelAriaProps.id).not.toBe(labelledComponentAriaProps.id);
    expect(labelAriaProps.htmlFor).toBe(labelledComponentAriaProps.id);
    expect(labelledComponentAriaProps['aria-labelledby']).toBe(`blah1 ${labelAriaProps.id}`);
  });

  it('should not concat the label id onto aria-labelledby if the label id is', () => {
    let labelProps = {
      id: 'blah1'
    };
    let labelledComponentProps = {
      'aria-labelledby': 'blah1'
    };
    
    let {labelAriaProps, labelledComponentAriaProps} = renderLabelHook(labelProps, labelledComponentProps);
    expect(labelAriaProps.id).toBe(labelledComponentAriaProps['aria-labelledby']);
    expect(labelAriaProps.htmlFor).toBe(labelledComponentAriaProps.id);
    expect(labelledComponentAriaProps.id).toBeDefined();
    expect(labelledComponentAriaProps['aria-labelledby']).toBe(labelProps.id);
  });

  it('should not modify the ids or htmlFor if they are passed in by the user', () => {
    let labelProps = {
      id: 'blah',
      htmlFor: 'blah2'
    };
    let labelledComponentProps = {
      id: 'blah2',
      'aria-labelledby': 'blah'
    };
    
    let {labelAriaProps, labelledComponentAriaProps} = renderLabelHook(labelProps, labelledComponentProps);
    expect(labelAriaProps).toEqual(labelProps);
    expect(labelledComponentAriaProps).toEqual(labelledComponentProps);
    expect(labelAriaProps.id).toBe(labelledComponentAriaProps['aria-labelledby']);
    expect(labelAriaProps.htmlFor).toBe(labelledComponentAriaProps.id);
  });

  it('should append the labelee\'s id to its own aria-labelledby if it has a aria-label', () => {
    let labelProps = {
      id: 'labelId',
      htmlFor: 'labeleeId'
    };
    let labelledComponentProps = {
      id: 'labeleeId',
      'aria-labelledby': 'someOtherId',
      'aria-label': 'caption'
    };

    let {labelAriaProps, labelledComponentAriaProps} = renderLabelHook(labelProps, labelledComponentProps);
    expect(labelAriaProps.id).toBe(labelProps.id);
    expect(labelAriaProps.htmlFor).toBe(labelProps.htmlFor);
    expect(labelledComponentAriaProps.id).toBe(labelledComponentProps.id);
    expect(labelledComponentAriaProps['aria-labelledby']).toBe('someOtherId labelId labeleeId');
        
  });
});