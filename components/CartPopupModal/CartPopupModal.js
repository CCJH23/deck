import { ArrowDropDownCircleOutlined } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  Button,
  Modal,
  Typography,
  Backdrop,
  Fade,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Stack,
  Menu,
  MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import { PropTypes } from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';

import { ItemPropType } from '../../globals';
import { CART_ITEM_TYPE_DEPOSIT, CART_ITEM_TYPE_WITHDRAW } from '../../globals';
import { addToCart } from '../../utils/cart-utils/addToCart';
import { getCartState } from '../../utils/cart-utils/getCartState';
import { getMaxWithdrawalQty } from '../../utils/cart-utils/getMaxWithdrawalQty';
import { SnackBarAlerts } from '../SnackBarAlerts';

const CartPopupModal = ({ type, item, selector, setCartState, disabled }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openSelector = Boolean(anchorEl);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const hasExpiry = !!item.expirydates[0].expirydate;
  const showDropdown = hasExpiry && item.expirydates.length > 1;
  const preselectedExpiryId =
    selector == 'All'
      ? item.expirydates[0].id
      : item.expirydates.find((itemExpiry) => itemExpiry.id == selector).id;
  const [selectedExpiryId, setSelectedExpiryId] = useState(preselectedExpiryId);

  useEffect(() => {
    const preselectedExpiryId =
      selector == 'All'
        ? item.expirydates[0].id
        : item.expirydates.find((itemExpiry) => itemExpiry.id == selector).id;

    setSelectedExpiryId(preselectedExpiryId);
  }, [item, hasExpiry, selector]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSelector = () => {
    setAnchorEl(null);
  };

  const getExpiryFromId = (expiryId) => {
    return (
      item.expirydates.find((itemExpiry) => itemExpiry.id == expiryId)
        .expirydate || 'No Expiry'
    );
  };

  const [maxOpenedQty, setMaxOpenedQty] = useState(Infinity);
  const [maxUnopenedQty, setMaxUnopenedQty] = useState(Infinity);

  const validationSchema = yup.object({
    openedQty: yup
      .number('Enter a number for opened quantity')
      .min(0, 'Number cannot be negative')
      .max(maxOpenedQty, 'Number cannot be more than that'),
    unopenedQty: yup
      .number('Enter a number for unopened quantity')
      .min(0, 'Number cannot be negative')
      .max(maxUnopenedQty, 'Number cannot be more than that'),
  });

  const formik = useFormik({
    initialValues: {
      openedQty: '',
      unopenedQty: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (values.openedQty == '') {
        values.openedQty = 0;
      }
      if (values.unopenedQty == '') {
        values.unopenedQty = 0;
      }
      if (values.openedQty == 0 && values.unopenedQty == 0) {
        handleClose();
        resetForm();
        return;
      }
      if (getCartState() !== '' && getCartState() !== type) {
        alert("You can't deposit and withdraw at the same time!");
        return;
      }
      const isDeposit = type == CART_ITEM_TYPE_DEPOSIT;

      setCartState(type);
      const cartItem = {
        ...item,
        expiryId: selectedExpiryId,
        type: isDeposit ? CART_ITEM_TYPE_DEPOSIT : CART_ITEM_TYPE_WITHDRAW,
        cartOpenedQuantity: formik.values.openedQty,
        cartUnopenedQuantity: formik.values.unopenedQty,
      };

      addToCart(cartItem);
      setSnackbarOpen(true);

      handleClose();
      resetForm();
    },
  });

  const setMaxQtys = useCallback(
    (expiryId) => {
      const {
        maxOpenedQty: calculatedMaxOpenedQty,
        maxUnopenedQty: calculatedMaxUnopenedQty,
      } = getMaxWithdrawalQty(expiryId, item);
      setMaxOpenedQty(calculatedMaxOpenedQty);
      setMaxUnopenedQty(calculatedMaxUnopenedQty);
    },
    [item],
  );

  return (
    <>
      <SnackBarAlerts
        severity='success'
        open={snackbarOpen}
        message='Added to cart'
        onClose={() => setSnackbarOpen(false)}
      />
      <Button
        size='small'
        variant='contained'
        color={type == CART_ITEM_TYPE_DEPOSIT ? 'success' : 'error'}
        onClick={handleOpen}
        disabled={disabled}
      >
        {type}
      </Button>

      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Stack
            spacing={2}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              boxShadow: 24,
              bgcolor: 'background.paper',
              p: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              '& > :last-child': {
                marginTop: 5,
              },
            }}
          >
            {item.imgpic ? (
              <Avatar
                alt={`${item.name}`}
                src={`${item.imgpic}`}
                sx={{ width: 90, height: 90 }}
              />
            ) : (
              <img
                src='/static/inventory/img/logo.png'
                width={90}
                height={90}
              />
            )}
            <Typography id='transition-modal-title' variant='h4' component='h2'>
              {item.name}
            </Typography>
            <Chip
              label={getExpiryFromId(selectedExpiryId)}
              role='chip'
              aria-label={getExpiryFromId(selectedExpiryId)}
              aria-controls={openSelector ? 'fade-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={openSelector ? 'true' : undefined}
              onClick={handleClick}
              deleteIcon={
                showDropdown ? <ArrowDropDownCircleOutlined /> : undefined
              }
              onDelete={showDropdown ? handleClick : undefined}
            />
            {showDropdown && (
              <Menu
                id='fade-menu'
                MenuListProps={{
                  'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorEl}
                open={openSelector}
                onClose={handleCloseSelector}
                TransitionComponent={Fade}
              >
                {item.expirydates.map((itemExpiry) => {
                  return (
                    <MenuItem
                      key={itemExpiry.expirydate}
                      onClick={() => {
                        setSelectedExpiryId(itemExpiry.id);
                        setMaxQtys(itemExpiry.id);
                        handleCloseSelector();
                      }}
                    >
                      {itemExpiry.expirydate}
                    </MenuItem>
                  );
                })}
              </Menu>
            )}

            <TextField
              id='filled-basic'
              type='number'
              label='Opened Qty'
              variant='filled'
              name='openedQty'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>{item.unit}</InputAdornment>
                ),
              }}
              value={formik.values.openedQty}
              onChange={formik.handleChange}
              error={
                formik.touched.openedQty && Boolean(formik.errors.openedQty)
              }
              helperText={formik.touched.openedQty && formik.errors.openedQty}
            />
            <TextField
              id='filled-basic'
              type='number'
              label='Unopened Qty'
              variant='filled'
              name='unopenedQty'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>{item.unit}</InputAdornment>
                ),
              }}
              value={formik.values.unopenedQty}
              onChange={formik.handleChange}
              error={
                formik.touched.unopenedQty && Boolean(formik.errors.unopenedQty)
              }
              helperText={
                formik.touched.unopenedQty && formik.errors.unopenedQty
              }
            />
            {type == CART_ITEM_TYPE_DEPOSIT ? (
              <Button
                variant='contained'
                role='submit-button'
                color='success'
                endIcon={<AddCircleIcon />}
                onClick={formik.handleSubmit}
              >
                Deposit
              </Button>
            ) : (
              <Button
                variant='contained'
                role='submit-button'
                color='error'
                endIcon={<RemoveCircleIcon />}
                onClick={formik.handleSubmit}
              >
                Withdraw
              </Button>
            )}
          </Stack>
        </Fade>
      </Modal>
    </>
  );
};

CartPopupModal.propTypes = {
  type: PropTypes.string.isRequired,
  item: ItemPropType.isRequired,
  selector: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
  ]),
  setCartState: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default CartPopupModal;
