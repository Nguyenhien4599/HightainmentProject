import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { DataContext, IDataContext } from '@/context/DataContextProvider';
import Form from 'react-bootstrap/Form';

import { mainBackgroundColor, primaryColor } from '@/const/colors';
import { Tag, Track, Review, ReviewTagRating } from '@/types/domain-models';
import RatingStars from '@/components/ratingStars';
import { useContext, useEffect, useState, Fragment } from 'react';

import { ApiContext, IApiContext } from '@/context/ApiContextProvider';

interface ReviewModalProps {
    open: boolean;
    setOpen: (b: boolean) => void;
    track: Track;
    onSave: (review: Review) => void;
    previousReview?: Review;
    setMode?: (mode: 'open' | 'close') => void;
}

function AddReviewModal({ open, setOpen, track, onSave, previousReview, setMode }: ReviewModalProps) {
    const { tagIdToTag } = useContext<IDataContext>(DataContext);
    const [overallRating, setOverallRating] = useState<number | undefined>(previousReview?.rating);
    previousReview?.tagRatings.reduce((acc: { [key: number]: number }, reviewTagRating: ReviewTagRating) => {
        acc[reviewTagRating.tagID] = reviewTagRating.tagRating;
        return acc;
    }, {});
    const [tagIdToRating, setTagIdToRating] = useState<{ [key: number]: number }>(
        previousReview?.tagRatings.reduce((acc: { [key: number]: number }, reviewTagRating: ReviewTagRating) => {
            acc[reviewTagRating.tagID] = reviewTagRating.tagRating;
            return acc;
        }, {}) || {},
    );
    const { addReview, updateReview } = useContext<IApiContext>(ApiContext);
    const [buttonEnabled, setButtonEnabled] = useState(previousReview ? true : false);
    const [review, setReview] = useState(previousReview?.content || '');
    const [tagsToRate, setTagsToRate] = useState<Tag[]>([]);

    useEffect(() => {
        if (Object.keys(tagIdToTag).length === 0) {
            return;
        }
        const TOP_TAG_IDS = [16, 9];
        const TOP_TAGS = TOP_TAG_IDS.map((id: number) => tagIdToTag[id]);
        setTagsToRate([...TOP_TAGS, ...track.tags.filter((t: Tag) => !TOP_TAG_IDS.includes(t.id))]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagIdToTag]);

    if (Object.keys(tagIdToTag).length === 0 || !track) {
        return <></>;
    }

    const handleClose = () => {
        setOpen(false);
        setButtonEnabled(false);
        setMode && setMode('close');
    };

    const onSaveClicked = () => {
        if (!overallRating) {
            return;
        }

        setButtonEnabled(false);
        const reviewBody = {
            rating: overallRating,
            content: review,
            tagRatings: Object.entries(tagIdToRating).map(([tagId, rating]) => ({
                tagID: Number(tagId),
                tagName: tagIdToTag[Number(tagId)].name,
                tagRating: rating,
            })),
        };
        if (previousReview?.id) {
            updateReview(previousReview.id, reviewBody)
                .then((review: Review | null) => {
                    if (!review) {
                        return;
                    }
                    setOpen(false);
                    onSave(review);
                    setButtonEnabled(true);
                })
                .catch((error) => {
                    setButtonEnabled(true);
                });
        } else {
            addReview(track.title.id, track.id, reviewBody)
                .then((review: Review | null) => {
                    if (!review) {
                        return;
                    }
                    setOpen(false);
                    onSave(review);
                    setButtonEnabled(true);
                })
                .catch((error) => {
                    setButtonEnabled(true);
                });
        }
    };

    return (
        <>
            <Modal show={open} onHide={handleClose}>
                <Modal.Header style={{ backgroundColor: mainBackgroundColor, color: 'white' }} closeButton>
                    <Modal.Title>Review for {track.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: mainBackgroundColor, color: 'white', fontSize: 20 }}>
                    <>
                        <Form>
                            <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlInput1"
                                style={{ borderBottomWidth: 1 }}
                            >
                                <Form.Label>Overall Rating</Form.Label>
                                <RatingStars
                                    rating={overallRating}
                                    style={{ marginBottom: 20 }}
                                    size="2xl"
                                    onClick={(rating: number) => {
                                        setButtonEnabled(true);
                                        setOverallRating(rating);
                                    }}
                                />
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlTextarea1"
                                style={{ borderBottomWidth: 1 }}
                            >
                                <Form.Label>Ratings for tag (Optional)</Form.Label>
                                {tagsToRate.map((tag: Tag, i) => {
                                    return (
                                        <Fragment key={i}>
                                            <p color="white" style={{ marginBottom: 4 }}>
                                                {tag.name}
                                            </p>
                                            <RatingStars
                                                rating={tagIdToRating[tag.id]}
                                                onClick={(rating: number) =>
                                                    setTagIdToRating({ ...tagIdToRating, [tag.id]: rating })
                                                }
                                                style={{ marginBottom: 20 }}
                                                size="xl"
                                            ></RatingStars>
                                        </Fragment>
                                    );
                                })}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Review (Optional)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={review}
                                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setReview(event.target.value)
                                    }
                                    placeholder="Write your review..."
                                />
                            </Form.Group>
                        </Form>
                    </>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: mainBackgroundColor }}>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        disabled={!buttonEnabled}
                        color={primaryColor}
                        style={{ backgroundColor: primaryColor, borderWidth: 0 }}
                        onClick={onSaveClicked}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddReviewModal;
