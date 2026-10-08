'use client';

import type { GalleryTile } from './menu-data';

import Image from 'next/image';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { Carousel, useCarousel } from 'src/components/carousel';

// ----------------------------------------------------------------------

const DESKTOP_SCROLL_STEP = 360;

type MenuDishGalleryProps = {
  tiles: GalleryTile[];
};

export function MenuDishGallery({ tiles }: MenuDishGalleryProps) {
  const carousel = useCarousel({ loop: false, align: 'start' });
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateDesktopScrollState = useCallback(() => {
    const el = desktopScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateDesktopScrollState();
    window.addEventListener('resize', updateDesktopScrollState);
    return () => window.removeEventListener('resize', updateDesktopScrollState);
  }, [updateDesktopScrollState]);

  // Lets a plain (vertical) mouse wheel scroll the row horizontally — without
  // this, desktop mouse users would need to hold shift to use the native
  // overflow-x scroll. Registered natively (not via onWheel) because React
  // attaches wheel listeners as passive, which silently ignores preventDefault.
  useEffect(() => {
    const el = desktopScrollRef.current;
    if (!el) return undefined;

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) return;

      el.scrollLeft += event.deltaY;
      event.preventDefault();
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  const handleDesktopScroll = (direction: 'left' | 'right') => {
    desktopScrollRef.current?.scrollBy({
      left: direction === 'left' ? -DESKTOP_SCROLL_STEP : DESKTOP_SCROLL_STEP,
      behavior: 'smooth',
    });
  };

  const handleDesktopDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = desktopScrollRef.current;
    if (!el) return;
    event.preventDefault(); // stop native image-drag ghost from fighting the scroll drag
    isDraggingRef.current = true;
    dragStartXRef.current = event.pageX;
    dragScrollLeftRef.current = el.scrollLeft;
  };

  const handleDesktopDragMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = desktopScrollRef.current;
    if (!el || !isDraggingRef.current) return;
    event.preventDefault();
    el.scrollLeft = dragScrollLeftRef.current - (event.pageX - dragStartXRef.current);
  };

  const handleDesktopDragEnd = () => {
    isDraggingRef.current = false;
  };

  const renderHotspots = (tile: GalleryTile) =>
    tile.hotspots.map((hotspot) => (
      <Tooltip
        key={`${hotspot.top}-${hotspot.left}`}
        arrow
        placement="right"
        enterTouchDelay={0}
        leaveTouchDelay={4000}
        title={
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="subtitle2" sx={{ color: 'inherit' }}>
              {hotspot.englishName}
            </Typography>
            {hotspot.chineseName && (
              <Typography variant="body2" sx={{ color: 'inherit', opacity: 0.8, mt: 0.5 }}>
                {hotspot.chineseName}
              </Typography>
            )}
            {hotspot.description && (
              <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.8, mt: 1, display: 'block' }}>
                {hotspot.description}
              </Typography>
            )}
          </Box>
        }
        slotProps={{ tooltip: { sx: { p: 1.5, maxWidth: 260 } } }}
      >
        <IconButton
          disableRipple
          sx={{
            position: 'absolute',
            top: hotspot.top,
            left: hotspot.left,
            transform: 'translate(-50%, -50%)',
            width: 18,
            height: 18,
            p: 0,
            bgcolor: 'primary.main',
            border: '2px solid',
            borderColor: 'common.white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transition: (theme) => theme.transitions.create('transform'),
            '&:hover': { transform: 'translate(-50%, -50%) scale(1.3)' },
            // Soft pulsing ring (shoppable-photo pattern) draws the eye to the
            // hotspot without a static marker looking stark against the photo.
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              border: '1.5px solid',
              borderColor: 'primary.main',
              animation: 'dishHotspotPulse 2.4s ease-out infinite',
            },
            '@keyframes dishHotspotPulse': {
              '0%': { transform: 'scale(0.7)', opacity: 0.55 },
              '100%': { transform: 'scale(2)', opacity: 0 },
            },
          }}
        />
      </Tooltip>
    ));

  const renderTile = (tile: GalleryTile, sizes: string) => (
    <Box
      key={tile.id}
      sx={{
        position: 'relative',
        gridColumn: `span ${tile.span?.cols ?? 1}`,
        gridRow: `span ${tile.span?.rows ?? 1}`,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Image fill alt={tile.alt} src={tile.image} sizes={sizes} style={{ objectFit: 'cover' }} />

      {renderHotspots(tile)}
    </Box>
  );

  return (
    <Box component="section" sx={{ pt: { xs: 4, md: 8 }, pb: { xs: 1, md: 2 } }}>
      <Container sx={{ textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 4, color: 'primary.main' }}>
          Meals Crafted for Postpartum Recovery
        </Typography>

        <Carousel
          carousel={carousel}
          sx={{ px: { xs: 2, sm: 3 }, display: { xs: 'block', md: 'none' } }}
          slotProps={{
            slide: {
              flex: { xs: '0 0 78%', sm: '0 0 46%' },
              pr: { xs: 2, sm: 2.5 },
            },
          }}
        >
          {tiles.map((tile) => (
            <Box
              key={tile.id}
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 5',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Image
                fill
                alt={tile.alt}
                src={tile.image}
                sizes="80vw"
                style={{ objectFit: 'cover' }}
              />

              {renderHotspots(tile)}
            </Box>
          ))}
        </Carousel>

        <Box
          sx={{
            mt: 3,
            mb: 1,
            gap: 1,
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'center',
          }}
        >
          {carousel.dots.scrollSnaps.map((_, index) => (
            <Box
              key={index}
              component="button"
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => carousel.dots.onClickDot(index)}
              sx={{
                p: 0,
                border: 'none',
                height: 8,
                borderRadius: 999,
                cursor: 'pointer',
                width: index === carousel.dots.selectedIndex ? 20 : 8,
                bgcolor: index === carousel.dots.selectedIndex ? 'primary.main' : 'action.disabled',
                transition: (theme) => theme.transitions.create(['width', 'background-color']),
              }}
            />
          ))}
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ display: { xs: 'none', md: 'block' } }}>
        <Box sx={{ position: 'relative' }}>
          {canScrollLeft && (
            <IconButton
              onClick={() => handleDesktopScroll('left')}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'common.white',
                boxShadow: '0 8px 20px rgba(0,0,0,0.16)',
                '&:hover': { bgcolor: 'common.white' },
              }}
            >
              <Iconify icon="eva:arrow-ios-back-fill" />
            </IconButton>
          )}

          {canScrollRight && (
            <IconButton
              onClick={() => handleDesktopScroll('right')}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'common.white',
                boxShadow: '0 8px 20px rgba(0,0,0,0.16)',
                '&:hover': { bgcolor: 'common.white' },
              }}
            >
              <Iconify icon="eva:arrow-ios-forward-fill" />
            </IconButton>
          )}

          <Box
            ref={desktopScrollRef}
            onScroll={updateDesktopScrollState}
            onMouseDown={handleDesktopDragStart}
            onMouseMove={handleDesktopDragMove}
            onMouseUp={handleDesktopDragEnd}
            onMouseLeave={handleDesktopDragEnd}
            sx={{
              display: 'grid',
              gridAutoFlow: 'column dense',
              gridTemplateRows: 'repeat(2, 220px)',
              // 4 columns fit the container width exactly (3 gaps of 12px
              // between them); anything beyond that scrolls into view.
              gridAutoColumns: 'calc((100% - 36px) / 4)',
              gap: 1.5,
              overflowX: 'auto',
              pb: 1,
              cursor: 'grab',
              userSelect: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {tiles.map((tile) => renderTile(tile, '25vw'))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
