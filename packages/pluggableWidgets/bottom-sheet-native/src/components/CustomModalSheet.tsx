import { createElement, ReactElement, ReactNode, useCallback, useEffect, useState } from "react";
import { InteractionManager, LayoutChangeEvent, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Modal, { OnSwipeCompleteParams } from "react-native-modal";
import { EditableValue, ValueStatus } from "mendix";
import { BottomSheetStyle, defaultPaddings } from "../ui/Styles";

const defaultStyle:BottomSheetStyle = {
    handleBar: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: "#ccc",
        alignSelf: "center",
        marginVertical: 10
    },
    container: {},
    containerWhenExpandedFullscreen: {},
    modal: {},
    modalItems: {}
};

interface CustomModalSheetProps {
    triggerAttribute?: EditableValue<boolean>;
    content?: ReactNode;
    styles: BottomSheetStyle;
    onOpen?: () => void;
    onClose?: () => void;
    enableSwipeDown: boolean;
}

export const CustomModalSheet = (props: CustomModalSheetProps): ReactElement => {
    const [currentStatus, setCurrentStatus] = useState(false);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (props.triggerAttribute && props.triggerAttribute.status === ValueStatus.Available) {
            if (props.triggerAttribute.value && !currentStatus) {
                InteractionManager.runAfterInteractions(() => setCurrentStatus(true));
            } else if (!props.triggerAttribute.value && currentStatus) {
                setCurrentStatus(false);
            }
        }
    }, [props.triggerAttribute, currentStatus]);

    const onOpenHandler = useCallback(() => {
        if (props.triggerAttribute && props.triggerAttribute.status === ValueStatus.Available) {
            props.triggerAttribute.setValue(true);
        }
        props.onOpen?.();
    }, [props.triggerAttribute]);

    const onCloseHandler = useCallback(() => {
        if (props.triggerAttribute && props.triggerAttribute.status === ValueStatus.Available) {
            props.triggerAttribute.setValue(false);
        }
        props.onClose?.();
    }, [props.triggerAttribute]);

    const onSwipeDown = useCallback(
        (params: OnSwipeCompleteParams): void => {
            if (props.enableSwipeDown && params.swipingDirection === "down") {
                onCloseHandler();
            }
        },
        [props.triggerAttribute, props.enableSwipeDown]
    );


    const onLayoutFullscreenHandler = (event: LayoutChangeEvent): void => {
        const height = event.nativeEvent.layout.height;
        if (height > 0) {
            setHeight(height);
        }
    };

    if (height === 0) {
        return (
            <View style={{ ...StyleSheet.absoluteFillObject, opacity: 0 }}>
                <SafeAreaView style={{ flex: 1 }} onLayout={onLayoutFullscreenHandler} />
            </View>
        );
    }

    return (
        <Modal
            isVisible={currentStatus}
            coverScreen
            backdropOpacity={0.5}
            onDismiss={onCloseHandler}
            onBackButtonPress={onCloseHandler}
            onBackdropPress={onCloseHandler}
            onModalShow={onOpenHandler}
            onSwipeComplete={onSwipeDown}
            swipeDirection={props.enableSwipeDown ? ["down"] : []}
            swipeThreshold={150}
            propagateSwipe={props.enableSwipeDown}
            useNativeDriverForBackdrop={true}
            style={props.styles.modal}
        >
            <View
                style={[
                    props.styles.container,
                    defaultPaddings,
                    { maxHeight: height - Number(defaultPaddings.paddingBottom) }
                ]}
            >
                {props.enableSwipeDown && (
                    <View style={[defaultStyle.handleBar, props.styles.handleBar]} />
                )}
                <ScrollView>
                    <TouchableOpacity activeOpacity={1}>
                        {props.content}
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    );
};